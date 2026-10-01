// BUN_TEST_SKIP_BUILD=1 reuses an existing playground/.output
import { afterAll, describe, expect, it } from 'bun:test'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('../../', import.meta.url))
const nuxtBin = join(root, 'node_modules/nuxt/bin/nuxt.mjs')
const serverEntry = join(root, 'playground/.output/server/index.mjs')
const port = 3500 + Math.floor(Math.random() * 400)
const base = `http://127.0.0.1:${port}`

let server: ReturnType<typeof Bun.spawn> | undefined

async function metadata(res: Response) {
  return await new Bun.Image(new Uint8Array(await res.arrayBuffer())).metadata()
}

describe('bun provider: built Nitro server on Bun', () => {
  afterAll(() => {
    server?.kill()
  })

  it('builds the playground with NITRO_PRESET=bun', () => {
    if (process.env.BUN_TEST_SKIP_BUILD && existsSync(serverEntry)) {
      return
    }
    const build = Bun.spawnSync({
      cmd: ['node', nuxtBin, 'build', 'playground'],
      cwd: root,
      env: { ...process.env, NITRO_PRESET: 'bun', NUXT_IMAGE_PROVIDER: 'bun' },
      stdout: 'pipe',
      stderr: 'pipe',
    })
    if (build.exitCode !== 0) {
      console.error(build.stdout.toString(), build.stderr.toString())
    }
    expect(build.exitCode).toBe(0)
    expect(existsSync(serverEntry)).toBe(true)
  }, 300_000)

  it('starts and answers on the bun route', async () => {
    server = Bun.spawn({
      cmd: ['bun', serverEntry],
      cwd: root,
      env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', NITRO_PORT: String(port), NITRO_HOST: '127.0.0.1' },
      stdout: 'pipe',
      stderr: 'pipe',
    })
    let ready = false
    for (let i = 0; i < 100 && !ready; i++) {
      try {
        ready = (await fetch(`${base}/provider/bun`)).ok
      }
      catch {
        await Bun.sleep(200)
      }
    }
    expect(ready).toBe(true)
  }, 60_000)

  it('renders /_bun/ URLs on the provider page', async () => {
    const html = await (await fetch(`${base}/provider/bun`)).text()
    expect(html).toContain('/_bun/s_300x300/images/colors.jpg')
    expect(html).toContain('/_bun/s_300x300/images/tacos.svg')
  })

  it('serves a resized WebP with the ipx headers', async () => {
    const res = await fetch(`${base}/_bun/s_300x300&f_webp/images/colors.jpg`)
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/webp')
    expect(res.headers.get('cache-control')).toContain('max-age=')
    expect(res.headers.get('etag')).toBeTruthy()
    expect(res.headers.get('x-content-type-options')).toBe('nosniff')
    expect(await metadata(res)).toMatchObject({ width: 450, height: 300, format: 'webp' })
  })

  it('serves images from every public dir, including layers', async () => {
    expect(await metadata(await fetch(`${base}/_bun/w_100/images/colors-layer.jpg`))).toMatchObject({ width: 100 })
  })

  it('passes SVG through and maps bad input to 4xx', async () => {
    const svg = await fetch(`${base}/_bun/w_100/images/tacos.svg`)
    expect(svg.status).toBe(200)
    expect(svg.headers.get('content-type')).toBe('image/svg+xml')
    expect((await fetch(`${base}/_bun/rotate_45/images/colors.jpg`)).status).toBe(400)
    expect((await fetch(`${base}/_bun/w_10/images/nope.jpg`)).status).toBe(404)
  })

  it('answers 304 to a matching ETag', async () => {
    const first = await fetch(`${base}/_bun/w_100/images/colors.jpg`)
    const etag = first.headers.get('etag')!
    const second = await fetch(`${base}/_bun/w_100/images/colors.jpg`, { headers: { 'if-none-match': etag } })
    expect(second.status).toBe(304)
  })
})
