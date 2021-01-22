import { resolve } from 'path'
import defu from 'defu'
import type { ModuleOptions } from './types'
import { pick, pkg } from './utils'
import { setupStaticGeneration } from './generate'
import { resolveProviders } from './provider'
import { createIPXMiddleware } from './ipx'

async function imageModule (moduleOptions: ModuleOptions) {
  const { nuxt, addPlugin, addServerMiddleware } = this

  const defaults: ModuleOptions = {
    provider: 'static',
    presets: [],
    static: {
      baseURL: '/_img',
      dir: resolve(nuxt.options.srcDir, nuxt.options.dir.static),
      clearCache: false,
      cacheDir: 'node_modules/.cache/nuxt-image', /* TODO */
      accept: [],
      sharp: {}
    },
    internalUrl: '',
    providers: {},
    accept: [],
    intersectOptions: {}
  }

  const options: ModuleOptions = defu(moduleOptions, nuxt.options.image, defaults)
  // Sanitize sizes
  if (!Array.isArray(options.sizes)) {
    // https://screensiz.es/
    options.sizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
  }

  options.provider = process.env.NUXT_IMAGE_PROVIDER || options.provider || 'static'

  const imageOptions = pick(options, ['sizes', 'presets', 'provider', 'intersectOptions', 'accept'])
  const providers = await resolveProviders(nuxt, options)

  // Transpile and alias runtime
  const runtimeDir = resolve(__dirname, 'runtime')
  nuxt.options.alias['~image'] = runtimeDir
  nuxt.options.build.transpile.push(runtimeDir, '@nuxt/image', 'allowlist', 'defu', 'ufo')

  // Add plugin
  addPlugin({
    fileName: 'image.js',
    src: resolve(runtimeDir, 'plugin.js'),
    options: {
      imageOptions,
      providers
    }
  })

  addServerMiddleware({
    path: options.static.baseURL,
    handle: createIPXMiddleware(options.static)
  })

  nuxt.options.build.loaders = defu({
    vue: { transformAssetUrls: { 'nuxt-img': 'src', 'nuxt-picture': 'src' } }
  }, nuxt.options.build.loaders || {})

  nuxt.hook('generate:before', () => {
    setupStaticGeneration(nuxt, options)
  })

  const LruCache = require('lru-cache')
  const cache = new LruCache()
  nuxt.hook('vue-renderer:context', (ssrContext) => {
    ssrContext.cache = cache
  })

  nuxt.hook('listen', (_, listener) => {
    options.internalUrl = `http://localhost:${listener.port}`
  })
}

(imageModule as any).meta = pkg

export default imageModule
