import { relative, resolve } from 'upath'
import { update as updaterc } from 'rc9'

import type { Module } from '@nuxt/types'
import defu from 'defu'

import { mkdirp, readFile, writeFile } from 'fs-extra'
import { lt } from 'semver'

import { setupStaticGeneration } from './generate'
import { resolveProviders, detectProvider } from './provider'
import type { ModuleOptions, CreateImageOptions } from './types'
import { pick, pkg } from './utils'

const imageModule: Module<ModuleOptions> = async function imageModule (moduleOptions) {
  const { nuxt, addPlugin, addServerMiddleware } = this

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

  // Only add IPX server middleware if the static/ipx provider is used
  if (
    (options.provider === 'static' && nuxt.options.dev) ||
    options.provider === 'ipx' ||
    Object.keys(options.providers).includes('ipx')
  ) {
    const rootDir = nuxt.options.rootDir
    const ipxOptions = {
      dir: relative(rootDir, options.dir),
      domains: options.domains,
      sharp: options.sharp
    }

    // In development, add IPX middleware directly

    const hasUserProvidedMiddleware = !!nuxt.options.serverMiddleware.find((mw: { path: string }) => mw.path && mw.path.startsWith('/_ipx'))

    if (!hasUserProvidedMiddleware) {
      const { createIPX, createIPXMiddleware } = await import('ipx')

      const ipx = createIPX(ipxOptions)
      addServerMiddleware({
        path: '/_ipx',
        handle: createIPXMiddleware(ipx)
      })
    }

    if (nuxt.options.dev && options.provider === 'ipx' && !hasUserProvidedMiddleware && lt(nuxt.constructor.version, '2.16.0')) {
      console.warn('If you would like to use the `ipx` provider at runtime, make sure to follow the instructions at https://image.nuxtjs.org/providers/ipx.')
    }

    // In production, add IPX module to .nuxtrc (used in Nuxt 2.16+)
    nuxt.hook('build:done', async () => {
      if (nuxt.options.dev) {
        return
      }

      const handler = await readFile(resolve(runtimeDir, 'ipx.js'), 'utf-8')
      const distDir = resolve(nuxt.options.buildDir, 'dist')
      const apiDir = resolve(distDir, 'api')
      const apiFile = resolve(apiDir, 'ipx.js')
      const relativeApiFile = '~~/' + relative(rootDir, apiFile)

      await mkdirp(apiDir)
      await writeFile(apiFile, handler.replace(/.__IPX_OPTIONS__./, JSON.stringify(ipxOptions)))

      updaterc({ serverMiddleware: [{ path: '/_ipx', handler: relativeApiFile }] }, { dir: distDir, name: '.nuxtrc' })
    })
  }

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
