import type { IncomingMessage, ServerResponse } from 'http'
import { createHash } from 'crypto'
import { readFile, writeFile } from 'fs-extra'
import { join, resolve } from 'upath'

const hash = createHash('sha256')
const hid = 'image-lazy-noscript'
const serializeProp = '__dangerouslyDisableSanitizersByTagID'

const wrapWithNoscripts = (result: { html: string }) => {
  // Replace <img> with <noscript>
  result.html = result.html.replace(/<img([^>]*data-src[^>]*>)/g, (r: string) => '<noscript>' + r + '</noscript>')
}

export async function setupInjectedLazyScript (nuxt: any): Promise<void> {
  // Load scripts (and hash polyfill script)

  const polyfillPath = resolve(__dirname, '../dist/runtime/scripts/lazy-polyfill.min.js')
  const polyfill = await readFile(polyfillPath, 'utf-8')

  hash.update(polyfill)
  const polyfillHash = hash.digest('hex').slice(0, 6)
  const polyfillScriptName = `lazy-polyfill-${polyfillHash}.js`

  const scriptPath = resolve(__dirname, '../dist/runtime/scripts/lazy-noscript.min.js')
  let script = await readFile(scriptPath, 'utf-8')

  const polyfillPublicPath = join(nuxt.options.build.publicPath, polyfillScriptName)
  script = script.replace('lazy-polyfill.js', polyfillPublicPath)

  // Add script to head to replace <noscript> with <img>

  nuxt.options.head.script = nuxt.options.head.script || []
  nuxt.options.head[serializeProp] = nuxt.options.head[serializeProp] || {}
  nuxt.options.head[serializeProp][hid] = ['innerHTML']

  nuxt.options.head.script.push({
    hid,
    innerHTML: script,
    body: true
  })

  // Handle route generation

  nuxt.hook('render:route', (_url: string, result: { html: string }) =>
    wrapWithNoscripts(result)
  )

  nuxt.hook('generate:page', (result: { html: string }) =>
    wrapWithNoscripts(result)
  )

  // Ensure our polyfill can be downloaded at /_nuxt/lazy-polyfill-[hash].js

  if (nuxt.options.dev) {
    nuxt.options.serverMiddleware.unshift({
      path: polyfillPublicPath,
      handle: (_req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
        res.end(polyfill)
      }
    })
  } else {
    nuxt.hook('build:compiled', async ({ name }: { name: string }) => {
      const distDir = resolve(nuxt.options.buildDir, 'dist', name)
      await writeFile(join(distDir, polyfillScriptName), polyfill)
    })
  }
}
