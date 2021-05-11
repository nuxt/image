import { resolve } from 'upath'
import { update as updaterc } from 'rc9'

import type { Module } from '@nuxt/types'
import defu from 'defu'

import { copyFile, mkdirp } from 'fs-extra'
import { setupStaticGeneration } from './generate'
import { resolveProviders, detectProvider } from './provider'
import type { ModuleOptions, CreateImageOptions } from './types'
import { pick, pkg } from './utils'

const imageModule: Module<ModuleOptions> = async function imageModule (moduleOptions) {
  const { nuxt, addPlugin, addModule } = this

  const defaults: ModuleOptions = {
    staticFilename: '[publicPath]/image/[hash][ext]',
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

  options.static = options.static || {}
  options.static.domains = options.domains

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

  const ipxModuleDev = resolve(runtimeDir, 'ipx.js')
  const ipxOptions = {
    dir: options.dir,
    domains: options.domains,
    sharp: options.sharp
  }

  addModule([ipxModuleDev, ipxOptions])

  // In production, add IPX module to nuxt config for Nuxt 2.16+
  nuxt.hook('build:done', async () => {
    if (nuxt.options.dev) {
      return
    }

    const distDir = resolve(this.options.buildDir, 'dist')
    const apiDir = resolve(distDir, 'server', 'modules')
    const apiModuleProd = resolve(apiDir, 'ipx.js')

    await mkdirp(apiDir)
    await copyFile(ipxModuleDev, apiModuleProd)

    updaterc({ modules: [[apiModuleProd, ipxOptions]] }, { dir: distDir, name: '.nuxtrc' })
  })

  nuxt.options.build.loaders = defu({
    vue: { transformAssetUrls: { 'nuxt-img': 'src', 'nuxt-picture': 'src' } }
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
