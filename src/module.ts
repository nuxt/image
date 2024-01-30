import { parseURL, withLeadingSlash } from 'ufo'
import { defineNuxtModule, addTemplate, addImports, createResolver, addComponent, addPlugin } from '@nuxt/kit'
import { resolve } from 'pathe'
import { resolveProviders, detectProvider, resolveProvider } from './provider'
import type { ImageProviders, ImageOptions, InputProvider, CreateImageOptions } from './types'

export interface ModuleOptions extends ImageProviders {
  inject: boolean
  provider: CreateImageOptions['provider']
  presets: { [name: string]: ImageOptions }
  dir: string
  domains: string[]
  alias: Record<string, string>
  screens: CreateImageOptions['screens']
  providers: { [name: string]: InputProvider | any }
  densities: number[]
  format: CreateImageOptions['format']
  quality?: CreateImageOptions['quality'],
  [key: string]: any
}

export * from './types'

export default defineNuxtModule<ModuleOptions>({
  defaults: nuxt => ({
    inject: false,
    provider: 'auto',
    dir: nuxt.options.dir.public,
    presets: {},
    domains: [] as string[],
    sharp: {},
    format: ['webp'],
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
    providers: {},
    alias: {},
    densities: [1, 2]
  }),
  meta: {
    name: '@nuxt/image',
    configKey: 'image',
    compatibility: {
      nuxt: '^3.1.0'
    }
  },
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // fully resolve directory
    options.dir = resolve(nuxt.options.srcDir, options.dir)

    // Normalize domains to hostname
    options.domains = options.domains.map((d) => {
      if (!d.startsWith('http')) { d = 'http://' + d }
      return parseURL(d).host
    }).filter(Boolean) as string[]

    // Normalize alias to start with leading slash
    options.alias = Object.fromEntries(Object.entries(options.alias).map(e => [withLeadingSlash(e[0]), e[1]]))

    const _detectedProvider = detectProvider(options.provider)!
    if (options.provider) {
      options[options.provider] = options[options.provider] || {}
    }
    options.provider = _detectedProvider?.provider
    options.densities = options.densities || []

    const imageOptions: Omit<CreateImageOptions, 'providers' | 'nuxt'> = pick(options, [
      'screens',
      'presets',
      'provider',
      'domains',
      'alias',
      'densities',
      'format',
      'quality'
    ])

    const providers = await resolveProviders(nuxt, options)

    // Run setup
    for (const p of providers) {
      if (typeof p.setup === 'function' && p.name !== 'ipx' && p.name !== 'ipxStatic') {
        await p.setup(p, options, nuxt)
      }
    }

    // Transpile and alias runtime
    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.alias['#image'] = runtimeDir
    nuxt.options.build.transpile.push(runtimeDir)

    addImports({
      name: 'useImage',
      from: resolver.resolve('runtime/composables')
    })

    // Add components
    addComponent({
      name: 'NuxtImg',
      filePath: resolver.resolve('./runtime/components/nuxt-img')
    })

    addComponent({
      name: 'NuxtPicture',
      filePath: resolver.resolve('./runtime/components/nuxt-picture')
    })

    // Add runtime options
    addTemplate({
      filename: 'image-options.mjs',
      getContents () {
        return `
${providers.map(p => `import * as ${p.importName} from '${p.runtime}'`).join('\n')}

export const imageOptions = ${JSON.stringify(imageOptions, null, 2)}

imageOptions.providers = {
${providers.map(p => `  ['${p.name}']: { provider: ${p.importName}, defaults: ${JSON.stringify(p.runtimeOptions)} }`).join(',\n')}
}
        `
      }
    })

    nuxt.hook('nitro:init', async (nitro) => {
      if (!options.provider || options.provider === 'ipx' || options.provider === 'ipxStatic' || _detectedProvider.auto) {
        const resolvedProvider = nitro.options.static || options.provider === 'ipxStatic'
          ? 'ipxStatic'
          : nitro.options.node ? 'ipx' : 'none'

        imageOptions.provider = options.provider = resolvedProvider
        options[resolvedProvider] = options[resolvedProvider] || {}

        const p = await resolveProvider(nuxt, resolvedProvider, {
          options: options[resolvedProvider]
        })
        if (!providers.some(p => p.name === resolvedProvider)) {
          providers.push(p)
        }
        if (typeof p.setup === 'function') {
          await p.setup(p, options, nuxt)
        }
      }
    })

    if (options.inject) {
      // Add runtime plugin
      addPlugin({ src: resolver.resolve('./runtime/plugin') })
    }

    // TODO: Transform asset urls that pass to `src` attribute on image components
  }
})

function pick<O extends Record<any, any>, K extends keyof O> (obj: O, keys: K[]): Pick<O, K> {
  const newobj = {} as Pick<O, K>
  for (const key of keys) {
    newobj[key] = obj[key]
  }
  return newobj
}
