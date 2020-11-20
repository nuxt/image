import path from 'path'
import fs from 'fs-extra'
import { ModuleOptions } from 'types'
import defu from 'defu'
import { downloadImage, getProviders, hash } from './utils'
import { cleanDoubleSlashes, getFileExtension } from './runtime/utils'
export type { Provider, RuntimeProvider } from 'types'

async function imageModule (moduleOptions: ModuleOptions) {
  const { nuxt, addServerMiddleware, addPlugin } = this

  const options: ModuleOptions = {
    providers: {}, // user custom providers
    presets: [],
    intersectOptions: {},
    accept: 'nuxtjs.org',
    sizes: [320, 420, 768, 1024, 1200, 1600],
    ...nuxt.options.image,
    ...moduleOptions
  }
  options.provider = process.env.NUXT_IMAGE_PROVIDER || options.provider || 'local'

  const pluginOptions = {
    sizes: options.sizes,
    defaultProvider: options.provider,
    intersectOptions: options.intersectOptions,
    imports: {} as { [name: string]: string },
    providers: [] as { name: string, import: string, options: any }[],
    presets: options.presets,
    allow: options.accept
  }

  const providers = await getProviders(nuxt, options)
  for (const p of providers) {
    pluginOptions.imports[p.importName] = p.runtime
    pluginOptions.providers.push({
      name: p.name,
      import: p.importName,
      options: p.runtimeOptions
    })

    if (typeof p.middleware === 'function') {
      addServerMiddleware({
        path: '/_image/' + p.name,
        handler: p.middleware
      })
    }
  }

  addPlugin({
    fileName: 'image.js',
    src: path.resolve(__dirname, '../templates/plugin.js'),
    options: pluginOptions
  })

  // Transpile and alias image src
  const runtimeDir = path.resolve(__dirname, './runtime')
  nuxt.options.alias['~image'] = runtimeDir
  nuxt.options.build.transpile.push(runtimeDir)

  nuxt.options.build.loaders = defu({
    vue: {
      transformAssetUrls: {
        'nuxt-img': 'src',
        'nuxt-picture': 'src'
      }
    }
  }, nuxt.options.build.loaders || {})

  nuxt.hook('generate:before', () => {
    handleStaticGeneration(nuxt, options)
  })

  const LruCache = require('lru-cache')
  const cache = new LruCache()
  nuxt.hook('vue-renderer:context', (ssrContext) => {
    ssrContext.cache = cache
    ssrContext.internalUrl = options.internalUrl
  })

  if (typeof nuxt.listen === 'function') {
    nuxt.listen(0).then((server) => {
      options.internalUrl = `http://localhost:${server.port}` // ! No tailing slash
    })
  }
}

function handleStaticGeneration (nuxt: any, options: ModuleOptions) {
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
    try { await fs.mkdir(path.join(generateDir, '_image')) } catch {}

    const downloads = Object.entries(staticImages)
      .map(([url, name]) => {
        if (!url.startsWith('http')) {
          url = cleanDoubleSlashes(options.internalUrl + url)
        }
        return downloadImage({
          url,
          name,
          outDir: generateDir
        })
      })
    await Promise.all(downloads)
  })
}

(imageModule as any).meta = require('../package.json')
export default imageModule
