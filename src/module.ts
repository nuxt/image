import process from 'node:process'

import { hasProtocol, parseURL, withLeadingSlash } from 'ufo'
import { defineNuxtModule, addTemplate, addImports, addServerImports, createResolver, addComponent, addPlugin, addServerTemplate, addTypeTemplate } from '@nuxt/kit'
import { join, relative, resolve } from 'pathe'
import { resolveProviders, detectProvider, resolveProvider, BuiltInProviders } from './provider'
import type { ImageOptions, InputProvider, CreateImageOptions, ImageModuleProvider, ImageProviders } from './types'
import { existsSync } from 'node:fs'

export interface ModuleOptions extends ImageProviders {
  inject: boolean
  provider: CreateImageOptions['provider']
  presets: { [name: string]: ImageOptions }
  dir: string
  dirs: string[]
  domains: string[]
  alias: Record<string, string>
  screens: CreateImageOptions['screens']
  providers: { [name: string]: InputProvider | any }
  densities: number[]
  format: CreateImageOptions['format']
  quality?: CreateImageOptions['quality']
}

export * from './types'

export default defineNuxtModule<ModuleOptions>({
  defaults: nuxt => ({
    inject: false,
    provider: 'auto',
    dir: nuxt.options.dir.public,
    dirs: [],
    presets: {},
    domains: [] as string[],
    sharp: {},
    format: ['webp'],
    // https://tailwindcss.com/docs/breakpoints
    screens: {
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536,
    },
    providers: {},
    alias: {},
    densities: [1, 2],
  }),
  meta: {
    name: '@nuxt/image',
    configKey: 'image',
    compatibility: {
      nuxt: '>=3.1.0',
    },
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // fully resolve directory
    options.dir = resolve(nuxt.options.srcDir, options.dir)

    const publicDirs = new Set(options.dirs)
    for (const layer of nuxt.options._layers) {
      const isRootLayer = layer.config.rootDir === nuxt.options.rootDir
      const srcDir = isRootLayer ? nuxt.options.srcDir : layer.config.srcDir
      const path = layer?.config.image?.dir || layer.config.dir?.public || 'public'

      publicDirs.add(resolve(srcDir, path))
    }

    options.dirs = [...publicDirs].filter(dir => existsSync(dir))

    nuxt.hook('nitro:config', (nitroConfig) => {
      for (const dir of options.dirs) {
        if (!existsSync(dir)) {
          continue
        }
        nitroConfig.publicAssets ||= []
        if (!nitroConfig.publicAssets.some(asset => asset && asset.dir === dir)) {
          nitroConfig.publicAssets.push({ dir, maxAge: 1 })
        }
      }
    })

    // Domains from environment variable
    const domainsFromENV = process.env.NUXT_IMAGE_DOMAINS?.replace(/\s/g, '').split(',') || []

    // Normalize domains to hostname
    options.domains = [...new Set([...options.domains, ...domainsFromENV])]
      .map(d => d && (parseURL(d.startsWith('http') ? d : ('http://' + d)).host))
      .filter(Boolean) as string[]

    // Normalize alias to start with leading slash
    options.alias = Object.fromEntries(Object.entries(options.alias).map(e => [withLeadingSlash(e[0]), e[1]]))

    options.provider = detectProvider(options.provider)!
    if (options.provider) {
      options[options.provider as keyof ImageProviders] = options[options.provider as keyof ImageProviders] || {}
    }
    options.densities = options.densities || []

    const imageOptions: Omit<CreateImageOptions, 'providers' | 'nuxt' | 'runtimeConfig'> = pick(options, [
      'screens',
      'presets',
      'provider',
      'domains',
      'alias',
      'densities',
      'format',
      'quality',
    ])

    const providers = await resolveProviders(nuxt, options)
    addTypeTemplate({
      filename: 'image/providers.d.ts',
      getContents() {
        const file = join(nuxt.options.buildDir, 'image')
        return `
        import { ImageProvider } from '@nuxt/image'
        declare module '@nuxt/image' {
          interface ProviderDefaults {
            provider: ${JSON.stringify(options.provider)}
          }
          interface ConfiguredImageProviders {
${providers.map(p => `            ${JSON.stringify(p.name)}: ${BuiltInProviders.includes(p.name as 'ipx') ? `ImageProviders[${JSON.stringify(p.name)}]` : `ReturnType<typeof import('${relative(file, p.runtime)}').default> extends ImageProvider<infer Options> ? Options : unknown `}`).join('\n')}
          }
          interface ImageProviders {
${BuiltInProviders.map(p => `            ${JSON.stringify(p)}: ReturnType<typeof import('${relative(file, resolver.resolve('./runtime/providers/' + p))}').default> extends ImageProvider<infer Options> ? Options : unknown `).join('\n')}
          }
        }
        export {}
        `
      },
    }, { nitro: true, nuxt: true, node: true, shared: true })

    // Run setup
    for (const p of providers) {
      if (typeof p.setup === 'function' && p.name !== 'ipx' && p.name !== 'ipxStatic') {
        await p.setup(p, options, nuxt)
      }
    }

    addImports({
      name: 'useImage',
      from: resolver.resolve('runtime/composables'),
    })

    // Add components
    addComponent({
      name: 'NuxtImg',
      filePath: resolver.resolve('./runtime/components/NuxtImg.vue'),
    })

    addComponent({
      name: 'NuxtPicture',
      filePath: resolver.resolve('./runtime/components/NuxtPicture.vue'),
    })

    // Add runtime options
    addTemplate({
      filename: 'image-options.mjs',
      getContents() {
        return generateImageOptions(providers, imageOptions)
      },
    })

    addServerImports([
      {
        name: 'useImage',
        from: resolver.resolve('runtime/server/utils/image'),
      },
    ])

    addServerTemplate({
      filename: '#internal/nuxt-image',
      getContents() {
        return generateImageOptions(providers, imageOptions)
      },
    })

    nuxt.hook('nitro:init', async (nitro) => {
      if (!options.provider || options.provider === 'ipx' || options.provider === 'ipxStatic' || options.ipx) {
        const hasExternalIPX = (options.ipx?.baseURL && hasProtocol(options.ipx.baseURL, { acceptRelative: true }))
        const resolvedProvider = hasExternalIPX
          ? 'ipx'
          : nitro.options.static || options.provider === 'ipxStatic'
            ? 'ipxStatic'
            : nitro.options.node ? 'ipx' : 'none'

        if (!options.provider || options.provider === 'ipx' || options.provider === 'ipxStatic') {
          imageOptions.provider = options.provider = resolvedProvider
        }

        // initialise provider options
        if (resolvedProvider === 'ipxStatic') {
          // handle the case of `ipx: {}` existing in options, but deploying a static site
          options.ipxStatic ||= options.ipx || {}
        }
        else {
          options[resolvedProvider] = options[resolvedProvider] || {}
        }

        const p = await resolveProvider(nuxt, resolvedProvider, {
          options: options[resolvedProvider],
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
      addPlugin({ src: resolver.resolve('./runtime/plugins/image') })
    }

    // TODO: Transform asset urls that pass to `src` attribute on image components
  },
})

function pick<O extends Record<any, any>, K extends keyof O>(obj: O, keys: K[]): Pick<O, K> {
  const newobj = {} as Pick<O, K>
  for (const key of keys) {
    newobj[key] = obj[key]
  }
  return newobj
}

function generateImageOptions(providers: ImageModuleProvider[], imageOptions: Omit<CreateImageOptions, 'providers' | 'nuxt' | 'runtimeConfig'>): string {
  return `
  ${providers.map(p => `import ${p.importName} from '${p.runtime}'`).join('\n')}
  
  export const imageOptions = {
    ...${JSON.stringify(imageOptions, null, 2)},
    /** @type {${JSON.stringify(imageOptions.provider)}} */
    provider: ${JSON.stringify(imageOptions.provider)},
    providers: {
      ${providers.map(p => `  ['${p.name}']: { setup: ${p.importName}, defaults: ${JSON.stringify(p.runtimeOptions)} }`).join(',\n')}
    }
  }
`
}
