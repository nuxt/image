
import { createWriteStream, existsSync } from 'fs'
import { promisify } from 'util'
import stream from 'stream'
import path from 'path'
import { mkdirp } from 'fs-extra'
import { dirname, join, relative, basename, trimExt } from 'upath'
import { fetch } from 'node-fetch-native'
import { joinURL, hasProtocol, parseURL, withoutTrailingSlash } from 'ufo'
import hasha from 'hasha'
import pLimit from 'p-limit'
import { ModuleOptions, MapToStatic, ResolvedImage } from './types'
import { hash, logger, guessExt } from './utils'

function getHash (input: string, url: string) {
  const staticFile = path.join(process.cwd(), 'static', input)

  if (existsSync(staticFile)) {
    return hash(`${hasha.fromFileSync(staticFile)}${url}`)
  }

  return hash(url)
}

export function setupStaticGeneration (nuxt: any, options: ModuleOptions) {
  const staticImages: Record<string, string> = {} // url ~> hashed file name

  nuxt.hook('vue-renderer:ssr:prepareContext', (renderContext: any) => {
    renderContext.image = renderContext.image || {}
    renderContext.image.mapToStatic = <MapToStatic> function ({ url, format }: ResolvedImage, input: string) {
      if (!staticImages[url]) {
        const { pathname } = parseURL(input)
        const params: any = {
          name: trimExt(basename(pathname)),
          ext: (format && `.${format}`) || guessExt(input),
          hash: getHash(input, url),
          // TODO: pass from runtimeConfig to mapStatic as param
          publicPath: nuxt.options.app.cdnURL ? '/' : withoutTrailingSlash(nuxt.options.build.publicPath)
        }

        staticImages[url] = options.staticFilename.replace(/\[(\w+)]/g, (match, key) => params[key] || match)
      }
      return joinURL(nuxt.options.app.cdnURL || nuxt.options.app.basePath, staticImages[url])
    }
  })

  nuxt.hook('generate:done', async () => {
    const limit = pLimit(8)
    const downloads = Object.entries(staticImages).map(([url, name]) => {
      if (!hasProtocol(url)) {
        url = joinURL(options.internalUrl, url)
      }
      return limit(() => downloadImage({
        url,
        name,
        outDir: nuxt.options.generate.dir
      }))
    })
    await Promise.all(downloads)
  })
}

const pipeline = promisify(stream.pipeline)
async function downloadImage ({ url, name, outDir }: { url: string, name: string, outDir: string }) {
  try {
    const response = await fetch(url)
    if (!response.ok) { throw new Error(`Unexpected response ${response.statusText}`) }
    const dstFile = join(outDir, name)
    await mkdirp(dirname(dstFile))
    await pipeline(response.body as any, createWriteStream(dstFile))
    logger.success('Generated static image ' + relative(process.cwd(), dstFile))
  } catch (error: any) {
    logger.error(error?.message)
  }
}
