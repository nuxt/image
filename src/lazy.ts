import { readFile } from 'fs-extra'
import { resolve } from 'upath'

const hid = 'image-lazy-load'
const serializeProp = '__dangerouslyDisableSanitizersByTagID'

export async function setupInjectedLazyScript (nuxt: any): Promise<void> {
  // Add script to head to replace <noscript> with <img>
  const scriptPath = resolve(__dirname, './lazy-script.js')
  const script = await readFile(scriptPath, 'utf-8')

  /* istanbul ignore next */
  nuxt.options.head.script = nuxt.options.head.script || []
  nuxt.options.head.script.push({
    hid,
    innerHTML: script,
    body: true
  })

  nuxt.options.head[serializeProp] = nuxt.options.head[serializeProp] || {}
  nuxt.options.head[serializeProp][hid] = ['innerHTML']

  nuxt.hook('render:route', (_url: string, result: { html: string }) => {
    result.html = result.html.replace(/<img([^>]*data-ssr-lazy[^>]*>)/g, (r: string) => '<noscript>' + r + '</noscript>')
  })
}
