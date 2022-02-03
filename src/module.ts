import { resolve } from 'upath'
import defu from 'defu'
import { parseURL, withLeadingSlash } from 'ufo'
import type { Module } from '@nuxt/types'
import { setupStaticGeneration } from './generate'
import { resolveProviders, detectProvider } from './provider'
import { pick, pkg } from './utils'
import type { ModuleOptions, CreateImageOptions } from './types'

const imageModule: Module<ModuleOptions> = async function imageModule (moduleOptions) {
  const { nuxt, addPlugin } = this

  const defaults: ModuleOptions = {
    staticFilename: '[publicPath]/image/[hash][ext]',
    provider: 'auto',
    presets: {},
    dir: resolve(nuxt.options.srcDir, nuxt.options.dir.static),
    domains: [],
    sharp: {},
    strategy: 'desktop-first',
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
    alias: {}
  }

  const options: ModuleOptions = defu(moduleOptions, nuxt.options.image, defaults)

  // Normalize domains to hostname
  options.domains = options.domains
    .map(domain => parseURL(domain, 'https://').host)
    .filter(Boolean) as string[]

  // Normalize alias to start with leading slash
  options.alias = Object.fromEntries(Object.entries(options.alias).map(e => [withLeadingSlash(e[0]), e[1]]))

  options.provider = detectProvider(options.provider, nuxt.options.target === 'static')
  options[options.provider] = options[options.provider] || {}

  const imageOptions: Omit<CreateImageOptions, 'providers'> = pick(options, [
    'screens',
    'presets',
    'provider',
    'domains',
    'alias',
    'strategy'
  ])

  const providers = resolveProviders(nuxt, options)

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

  // Transform asset urls that pass to `src` attribute on image components
  nuxt.options.build.loaders = defu({
    vue: { transformAssetUrls: { 'nuxt-img': 'src', 'nuxt-picture': 'src', NuxtPicture: 'src', NuxtImg: 'src' } }
  }, nuxt.options.build.loaders || {})

  nuxt.hook('generate:before', () => {
    setupStaticGeneration(nuxt, options)
  })

  const LruCache = await import('lru-cache').then(r => r.default || r)
  const cache = new LruCache()
  nuxt.hook('vue-renderer:context', (ssrContext: any) => {
    ssrContext.cache = cache
  })

  nuxt.hook('listen', (_: any, listener: any) => {
    options.internalUrl = `http://localhost:${listener.port}`
  })
}

; (imageModule as any).meta = pkg

export default imageModule
