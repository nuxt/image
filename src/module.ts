import { parseURL, withLeadingSlash } from 'ufo'
import { defineNuxtModule, addTemplate, addImports, createResolver, addComponent, addPlugin } from '@nuxt/kit'
import { resolveProviders, detectProvider } from './provider'
import type { ImageProviders, ImageOptions, InputProvider, CreateImageOptions } from './types'

export interface ModuleOptions extends ImageProviders {
  staticFilename: string,
  provider: CreateImageOptions['provider']
  presets: { [name: string]: ImageOptions }
  dir: string
  domains: string[]
  sharp: any
  alias: Record<string, string>
  screens: CreateImageOptions['screens'],
  internalUrl: string
  providers: { [name: string]: InputProvider | any } & ImageProviders
  [key: string]: any
}

export * from './types'

export default defineNuxtModule<ModuleOptions>({
  defaults: {
    staticFilename: '[publicPath]/image/[hash][ext]',
    provider: 'auto',
    dir: '',
    presets: {},
    domains: [] as string[],
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
    alias: {}
  },
  meta: {
    name: '@nuxt/image',
    configKey: 'image',
    compatibility: {
      nuxt: '^3.1.0'
    }
  },
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Normalize domains to hostname
    options.domains = options.domains.map((d) => {
      if (!d.startsWith('http')) { d = 'http://' + d }
      return parseURL(d).host
    }).filter(Boolean) as string[]

    // Normalize alias to start with leading slash
    options.alias = Object.fromEntries(Object.entries(options.alias).map(e => [withLeadingSlash(e[0]), e[1]]))

    options.provider = detectProvider(options.provider)
    options[options.provider] = options[options.provider] || {}

    const imageOptions: Omit<CreateImageOptions, 'providers'> = pick(options, [
      'screens',
      'presets',
      'provider',
      'domains',
      'alias'
    ])

    const providers = await resolveProviders(nuxt, options)

    // Run setup
    for (const p of providers) {
      if (typeof p.setup === 'function') {
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

    // Add runtime plugin
    addPlugin({ src: resolver.resolve('./runtime/plugin') })

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
