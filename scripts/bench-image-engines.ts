// Benchmarks ipx (sharp, Node) against bun (Bun.Image, Bun) on identical requests.
// Usage: pnpm bench:image-engines [--skip-build] [--json out.json]
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { cpus, totalmem, platform, arch, release } from 'node:os'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const nuxtBin = join(root, 'node_modules/nuxt/bin/nuxt.mjs')
const args = process.argv.slice(2)
const skipBuild = args.includes('--skip-build')
const jsonOut = args[args.indexOf('--json') + 1]
const SEQUENTIAL_RUNS = Number(process.env.BENCH_RUNS || 20)
const CONCURRENCY = Number(process.env.BENCH_CONCURRENCY || 8)
const CONCURRENT_REQUESTS = Number(process.env.BENCH_CONCURRENT_REQUESTS || 64)
const PAGE_RUNS = 5

interface Engine {
  name: 'ipx' | 'bun'
  envName: string
  prefix: string
  runtime: string[]
  port: number
  process?: ReturnType<typeof spawn>
  rssMB?: number
}

const engines: Engine[] = [
  { name: 'ipx', envName: 'benchIpx', prefix: '/_ipx', runtime: ['node'], port: 3711 },
  { name: 'bun', envName: 'benchBun', prefix: '/_bun', runtime: ['bun'], port: 3712 },
]

/** Same modifiers for both engines; `{p}` is the engine's route prefix. */
const scenarios = [
  { id: 'thumb-webp', label: '24 MP JPEG → 300×300 box, WebP (thumbnail)', path: '{p}/s_300x300&f_webp/images/colors.jpg' },
  { id: 'hero-jpeg', label: '24 MP JPEG → 1200 px wide JPEG', path: '{p}/w_1200&f_jpeg&q_80/images/colors.jpg' },
  { id: 'photo-webp', label: '2 MP JPEG → 640 px wide WebP', path: '{p}/w_640&f_webp/images/everest.jpg' },
  { id: 'png-webp', label: 'PNG logo → 200 px wide WebP', path: '{p}/w_200&f_webp/images/nuxt.png' },
  { id: 'png-png', label: 'PNG logo → 400 px wide PNG', path: '{p}/w_400&f_png/images/nuxt.png' },
  { id: 'svg', label: 'SVG (ipx: svgo optimise, bun: passthrough)', path: '{p}/_/images/tacos.svg' },
]

function run(cmd: string, cmdArgs: string[], env: Record<string, string> = {}) {
  const result = spawnSync(cmd, cmdArgs, { cwd: root, env: { ...process.env, ...env }, stdio: 'pipe', encoding: 'utf8' })
  if (result.status !== 0) {
    console.error(result.stdout, result.stderr)
    throw new Error(`${cmd} ${cmdArgs.join(' ')} failed with ${result.status}`)
  }
  return result.stdout
}

function build(engine: Engine) {
  const entry = join(root, `playground/.output/${engine.envName === 'benchIpx' ? 'bench-ipx' : 'bench-bun'}/server/index.mjs`)
  if (skipBuild && existsSync(entry)) {
    return entry
  }
  process.stdout.write(`Building playground for ${engine.name} …`)
  const t0 = performance.now()
  run('node', [nuxtBin, 'build', 'playground', '--envName', engine.envName], { NUXT_IMAGE_PROVIDER: engine.name })
  console.log(` ${Math.round((performance.now() - t0) / 1000)}s`)
  return entry
}

async function start(engine: Engine, entry: string) {
  engine.process = spawn(engine.runtime[0]!, [...engine.runtime.slice(1), entry], {
    cwd: root,
    env: { ...process.env, PORT: String(engine.port), HOST: '127.0.0.1', NITRO_PORT: String(engine.port), NITRO_HOST: '127.0.0.1', NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const url = `http://127.0.0.1:${engine.port}`
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(`${url}/provider/${engine.name}`)).ok) {
        return url
      }
    }
    catch {
      await new Promise(r => setTimeout(r, 200))
    }
  }
  throw new Error(`${engine.name} server did not start`)
}

async function timedFetch(url: string): Promise<{ ms: number, bytes: number, status: number, type: string }> {
  const t0 = performance.now()
  const res = await fetch(url)
  const buf = await res.arrayBuffer()
  return { ms: performance.now() - t0, bytes: buf.byteLength, status: res.status, type: res.headers.get('content-type') || '' }
}

function stats(samples: number[]) {
  const sorted = [...samples].sort((a, b) => a - b)
  // nearest-rank percentile
  const at = (q: number) => sorted[Math.max(0, Math.min(sorted.length - 1, Math.ceil(q * sorted.length) - 1))]!
  return { median: at(0.5), p95: at(0.95), mean: sorted.reduce((a, b) => a + b, 0) / sorted.length, min: sorted[0]!, max: sorted[sorted.length - 1]! }
}

async function pool<T>(items: T[], concurrency: number, fn: (item: T) => Promise<void>) {
  let next = 0
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (next < items.length) {
      await fn(items[next++]!)
    }
  }))
}

function rssOf(pid: number | undefined): number | undefined {
  if (!pid || platform() !== 'linux') {
    return
  }
  try {
    const status = readFileSync(`/proc/${pid}/status`, 'utf8')
    const kb = Number(/VmRSS:\s+(\d+)/.exec(status)?.[1])
    return Math.round(kb / 1024)
  }
  catch {
    return
  }
}

interface ScenarioResult {
  id: string
  label: string
  engines: Record<string, { median: number, p95: number, mean: number, bytes: number, status: number, type: string }>
}

async function main() {
  const entries = engines.map(engine => [engine, build(engine)] as const)
  const urls = new Map<string, string>()
  for (const [engine, entry] of entries) {
    urls.set(engine.name, await start(engine, entry))
  }

  for (const engine of engines) {
    for (const scenario of scenarios) {
      for (let i = 0; i < 3; i++) {
        await timedFetch(urls.get(engine.name) + scenario.path.replace('{p}', engine.prefix))
      }
    }
  }

  const results: ScenarioResult[] = []
  for (const scenario of scenarios) {
    const result: ScenarioResult = { id: scenario.id, label: scenario.label, engines: {} }
    for (const engine of engines) {
      const url = urls.get(engine.name) + scenario.path.replace('{p}', engine.prefix)
      const samples: number[] = []
      let last = { bytes: 0, status: 0, type: '' }
      for (let i = 0; i < SEQUENTIAL_RUNS; i++) {
        const r = await timedFetch(url)
        samples.push(r.ms)
        last = r
      }
      result.engines[engine.name] = { ...stats(samples), bytes: last.bytes, status: last.status, type: last.type }
    }
    results.push(result)
  }

  const throughput: Record<string, { rps: number, p95: number, median: number, wallMs: number }> = {}
  for (const engine of engines) {
    const mixed = Array.from({ length: CONCURRENT_REQUESTS }, (_, i) => urls.get(engine.name) + scenarios[i % scenarios.length]!.path.replace('{p}', engine.prefix))
    const samples: number[] = []
    const t0 = performance.now()
    await pool(mixed, CONCURRENCY, async (url) => {
      samples.push((await timedFetch(url)).ms)
    })
    const wallMs = performance.now() - t0
    const s = stats(samples)
    throughput[engine.name] = { rps: CONCURRENT_REQUESTS / (wallMs / 1000), p95: s.p95, median: s.median, wallMs }
  }

  // Page plus its images, same image list for both engines
  const ipxHtml = await (await fetch(`${urls.get('ipx')}/provider/ipx`)).text()
  const pageImages = [...new Set([...ipxHtml.matchAll(/(?:src|srcset)="([^"]+)"/g)].flatMap(m => m[1]!.split(',').map(s => s.trim().split(' ')[0]!)))]
    .map(s => s.replace(/&amp;/g, '&'))
    .filter(s => s.startsWith('/_ipx/') && !s.includes('unsplash'))
  const page: Record<string, { median: number, p95: number, images: number, bytes: number }> = {}
  for (const engine of engines) {
    const base = urls.get(engine.name)!
    const srcs = pageImages.map(s => s.replace('/_ipx/', `${engine.prefix}/`))
    const runs: number[] = []
    let bytes = 0
    for (let i = 0; i < PAGE_RUNS; i++) {
      const t0 = performance.now()
      await (await fetch(`${base}/provider/${engine.name}`)).text()
      bytes = 0
      await pool(srcs, 6, async (src) => {
        bytes += (await timedFetch(base + src)).bytes
      })
      runs.push(performance.now() - t0)
    }
    const s = stats(runs)
    page[engine.name] = { median: s.median, p95: s.p95, images: srcs.length, bytes }
  }

  for (const engine of engines) {
    engine.rssMB = rssOf(engine.process?.pid)
    engine.process?.kill()
  }

  const bunVersion = run('bun', ['--version']).trim()
  const ipxVersion = JSON.parse(readFileSync(join(root, 'node_modules/ipx/package.json'), 'utf8')).version
  const sharpVersion = readdirSync(join(root, 'node_modules/.pnpm')).find(name => name.startsWith('sharp@'))?.slice('sharp@'.length) || 'unknown'
  const env = {
    date: new Date().toISOString().slice(0, 10),
    cpu: `${cpus()[0]?.model.trim()} × ${cpus().length}`,
    memoryGB: Math.round(totalmem() / 1e9),
    os: `${platform()} ${release()} ${arch()}`,
    node: process.version,
    bun: bunVersion,
    ipx: `${ipxVersion} (sharp ${sharpVersion})`,
    runs: SEQUENTIAL_RUNS,
    concurrency: CONCURRENCY,
  }

  const fmt = (n: number) => n >= 100 ? String(Math.round(n)) : n.toFixed(1)
  const ratio = (a: number, b: number) => `${(a / b).toFixed(2)}×`
  const kb = (b: number) => `${(b / 1024).toFixed(1)} KB`
  const lines: string[] = []
  lines.push(`Environment: ${env.cpu}, ${env.memoryGB} GB, ${env.os}; Node ${env.node}, Bun ${env.bun}, ipx ${env.ipx}; ${env.runs} sequential runs per scenario, ${env.concurrency} in flight for throughput.`)
  lines.push('')
  lines.push('| Scenario | ipx median | ipx p95 | bun median | bun p95 | ipx ÷ bun | ipx bytes | bun bytes |')
  lines.push('| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |')
  for (const r of results) {
    const a = r.engines.ipx!
    const b = r.engines.bun!
    lines.push(`| ${r.label} | ${fmt(a.median)} ms | ${fmt(a.p95)} ms | ${fmt(b.median)} ms | ${fmt(b.p95)} ms | ${ratio(a.median, b.median)} | ${kb(a.bytes)} | ${kb(b.bytes)} |`)
  }
  lines.push('')
  lines.push(`| Mixed workload, ${CONCURRENT_REQUESTS} requests, ${CONCURRENCY} in flight | ipx | bun |`)
  lines.push('| --- | ---: | ---: |')
  lines.push(`| Throughput | ${throughput.ipx!.rps.toFixed(1)} req/s | ${throughput.bun!.rps.toFixed(1)} req/s |`)
  lines.push(`| Median latency | ${fmt(throughput.ipx!.median)} ms | ${fmt(throughput.bun!.median)} ms |`)
  lines.push(`| p95 latency | ${fmt(throughput.ipx!.p95)} ms | ${fmt(throughput.bun!.p95)} ms |`)
  lines.push(`| Provider page + its ${page.ipx!.images} local images (time to display proxy) | ${fmt(page.ipx!.median)} ms | ${fmt(page.bun!.median)} ms |`)
  lines.push(`| Server RSS after the run | ${engines[0]!.rssMB ?? '?'} MB | ${engines[1]!.rssMB ?? '?'} MB |`)
  const report = lines.join('\n')
  console.log('\n' + report)

  if (jsonOut && jsonOut !== '--skip-build') {
    writeFileSync(jsonOut, JSON.stringify({ env, results, throughput, page, rss: { ipx: engines[0]!.rssMB, bun: engines[1]!.rssMB }, report }, null, 2))
    console.log(`\nWrote ${jsonOut}`)
  }
}

main().catch((error) => {
  console.error(error)
  for (const engine of engines) {
    engine.process?.kill()
  }
  process.exit(1)
})
