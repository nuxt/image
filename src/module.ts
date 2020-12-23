import { resolve } from 'path'
import defu from 'defu'
import type { ModuleOptions } from './types'
import { pick, pkg, pkgDir } from './utils'
import { setupStaticGeneration } from './generate'
import { resolveProviders } from './provider'
import { createIPXMiddleware } from './ipx'

declare module '@nuxt/types' {
  interface Configuration { image: ModuleOptions }
}

async function imageModule (moduleOptions: ModuleOptions) {
  const { nuxt, addPlugin, addServerMiddleware } = this

  const defaults: ModuleOptions = {
    provider: 'local',
    presets: [],
    local: {
      baseURL: '/_img/ipx',
      dir: nuxt.options.dir.static,
      clearCache: false,
      cacheDir: 'node_modules/.cache/nuxt-image', /* TODO */
      accept: [],
      sharp: {}
    },
    sizes: [320, 420, 768, 1024, 1200, 1600],
    internalUrl: '',
    providers: {},
    accept: ['http://localhost'],
    intersectOptions: {}
  }

  const options: ModuleOptions = defu(moduleOptions, nuxt.options.image, defaults)

  options.provider = process.env.NUXT_IMAGE_PROVIDER || options.provider || 'local'

  const imageOptions = pick(options, ['sizes', 'presets', 'provider', 'intersectOptions', 'accept'])
  const providers = await resolveProviders(nuxt, options)

  addPlugin({
    fileName: 'image.js',
    src: resolve(pkgDir, 'templates/plugin.js'),
    options: {
      imageOptions,
      providers
    }
  })

  // Transpile and alias image src
  nuxt.options.alias['@nuxt/image/runtime'] = resolve(__dirname, 'runtime')
  nuxt.options.build.transpile.push(pkgDir, 'allowlist', 'defu', 'ufo')

  addServerMiddleware({
    path: options.local.baseURL,
    handle: createIPXMiddleware(options.local)
  })

  nuxt.options.build.loaders = defu({
    vue: { transformAssetUrls: { 'nuxt-img': 'src', 'nuxt-picture': 'src' } }
  }, nuxt.options.build.loaders || {})

  nuxt.hook('generate:before', () => {
    setupStaticGeneration(nuxt, options)
  })

  // const LruCache = require('lru-cache')
  // const cache = new LruCache()
  // nuxt.hook('vue-renderer:context', (ssrContext) => {
  //   ssrContext.cache = cache
  //   ssrContext.internalUrl = options.internalUrl
  // })

  // if (typeof nuxt.listen === 'function') {
  //   nuxt.listen(0).then((server) => {
  //     options.internalUrl = `http://localhost:${server.port}` // ! No tailing slash
  //   })
  // }
}

(imageModule as any).meta = pkg

export default imageModule
