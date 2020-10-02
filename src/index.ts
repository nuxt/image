import path from 'path'
import fs from 'fs-extra'
import upath from 'upath'
import { ModuleOptions, ProviderFactory } from 'types'
import { downloadImage, getFileExtension, hash, tryRequire } from './utils'
export type { Provider, RuntimeProvider } from 'types'

function imageModule (moduleOptions: ModuleOptions) {
  const { nuxt, addServerMiddleware, addPlugin } = this

  const options: ModuleOptions = {
    presets: [],
    ...nuxt.options.image,
    ...moduleOptions
  }

  // Ensure at least one provider is set
  if (!options.providers || !Object.keys(options.providers).length) {
    options.providers = { local: {} }
  }

  // Add default `lqip` preset
  if (!options.presets.some(preset => preset.name === 'lqip')) {
    options.presets.unshift({
      name: 'lqip',
      modifiers: {
        width: 30
      }
    })
  }

  // Apply local defaults
  if (options.providers.local && typeof options.providers.local === 'object') {
    options.providers.local = {
      dir: path.resolve(nuxt.options.srcDir, nuxt.options.dir.static),
      ...options.providers.local
    }
  }

  if (!options.defaultProvider) {
    options.defaultProvider = Object.keys(options.providers)[0]
  }

  interface ModuleProvider {
    name: string,
    options: any
    provider: ProviderFactory
  }

  const providers: ModuleProvider[] = Object.entries(options.providers)
    .map(([key, provider]) => loadProvider.call(this, key, provider))

  const pluginOptions = {
    defaultProvider: options.defaultProvider,
    imports: {} as { [name: string]: string },
    providers: [] as { name: string, import: string, options: any }[],
    presets: options.presets
  }

  for (const p of providers) {
    const { middleware, runtime, runtimeOptions } = p.provider(p.options)
    const importName = 'runtime_' + hash(runtime).substr(0, 8)
    pluginOptions.imports[importName] = upath.normalize(runtime)
    pluginOptions.providers.push({
      name: p.name,
      import: importName,
      options: runtimeOptions
    })

    if (typeof middleware === 'function') {
      addServerMiddleware({
        path: '/_image/' + p.name,
        handler: middleware
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

  nuxt.hook('generate:before', () => {
    handleStaticGeneration(nuxt)
  })
}

function loadProvider (key: string, provider: any) {
  const { nuxt } = this
  if (typeof provider === 'string') {
    provider = { provider }
  } else if (typeof provider === 'object') {
    provider = { options: provider }
  }

  if (!provider.name) {
    provider.name = key
  }
  if (!provider.provider) {
    provider.provider = provider.name
  }
  if (typeof provider.provider === 'string') {
    provider.provider = tryRequire('./providers/' + provider.provider) ||
      nuxt.resolver.requireModule(provider.provider)
  }
  // TODO: verify provider.provider and warn+skip if invalid
  return provider
}

function handleStaticGeneration (nuxt: any) {
  const staticImages = {} // url ~> hash

  nuxt.hook('vue-renderer:ssr:prepareContext', (renderContext) => {
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
    const { port } = nuxt.server.listeners[0]
    const { dir: generateDir } = nuxt.options.generate
    const host = 'http://localhost:' + port

    try { await fs.mkdir(path.join(generateDir, '_image')) } catch {}

    const downloads = Object.entries(staticImages)
      .map(([url, name]) => {
        if (!url.startsWith('http')) {
          url = host + url
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
