import { resolve } from 'path'
import defu from 'defu'
import type { ModuleOptions, CreateImageOptions } from './types'
import { pick, pkg } from './utils'
import { setupStaticGeneration } from './generate'
import { resolveProviders, detectProvider } from './provider'
import { createIPXMiddleware } from './ipx'

async function imageModule (moduleOptions: ModuleOptions) {
  const { nuxt, addPlugin, addServerMiddleware } = this

  const defaults: ModuleOptions = {
    staticFilename: '_nuxt/image/[hash][ext]',
    provider: 'auto',
    presets: {},
    dir: resolve(nuxt.options.srcDir, nuxt.options.dir.static),
    domains: [],
    sharp: {},
    // https://tailwindcss.com/docs/breakpoints
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536
    },
    internalUrl: '',
    providers: {},
    static: {},
    intersectOptions: {}
  }

  const options: ModuleOptions = defu(moduleOptions, nuxt.options.image, defaults)

  options.provider = detectProvider(options.provider)

  options[options.provider] = options[options.provider] || {}

  const imageOptions: Omit<CreateImageOptions, 'providers'> = pick(options, [
    'screens',
    'presets',
    'provider',
    'intersectOptions'
  ])

  options.static.domains = options.domains

  const providers = await resolveProviders(nuxt, options)

  // Run setup
  for (const p of providers) {
    if (typeof p.setup === 'function') {
      await p.setup(p, options, nuxt)
    }
  }

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
    path: '/_ipx',
    handle: createIPXMiddleware({
      dir: options.dir,
      domains: options.domains,
      sharp: options.sharp
    })
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
