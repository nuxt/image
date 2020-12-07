
import { createWriteStream, promises as fsp } from 'fs'
import { promisify } from 'util'
import stream from 'stream'
import { join } from 'upath'
import { ModuleOptions } from 'src/module'
import fetch from 'node-fetch'
import { joinURL, hasProtocol } from '@nuxt/ufo'
import { getFileExtension } from './runtime/utils'
import { hash, logger } from './utils'

const pipeline = promisify(stream.pipeline)

export function setupStaticGeneration (nuxt: any, options: ModuleOptions) {
  const staticImages = {} // url ~> hash

  nuxt.hook('vue-renderer:ssr:prepareContext', (renderContext) => {
    renderContext.isGenerating = true
    renderContext.mapImage = ({ url, isStatic, format, src }) => {
      if (!isStatic) {
        return url
      }
      if (!staticImages[url]) {
        format = format || getFileExtension(src)
        staticImages[url] = '_image/' + hash(url) + '.' + format
      }
      return nuxt.options.router.base + staticImages[url]
    }
  })

  nuxt.hook('generate:done', async () => {
    const { dir: generateDir } = nuxt.options.generate
    try { await fsp.mkdir(join(generateDir, '_image')) } catch { }

    const downloads = Object.entries(staticImages).map(([url, name]) => {
      if (!hasProtocol(url)) {
        url = joinURL(options.internalUrl, url)
      }
      return downloadImage({ url, name, outDir: generateDir })
    })
    await Promise.all(downloads)
  })
}

async function downloadImage ({ url, name, outDir }) {
  try {
    const response = await fetch(url)
    if (!response.ok) { throw new Error(`unexpected response ${response.statusText}`) }
    await pipeline(response.body, createWriteStream(join(outDir, name)))
    logger.success('Generated image ' + name)
  } catch (error) {
    logger.error(error.message)
  }
}
