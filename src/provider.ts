import { normalize, resolve, dirname } from 'upath'
import { writeJson, mkdirp } from 'fs-extra'
import type { ModuleOptions, InputProvider, ImageModuleProvider, ProviderSetup } from './types'
import { hash } from './utils'

const BuiltInProviders = [
  'cloudinary',
  'fastly',
  'imagekit',
  'imgix',
  'ipx',
  'static',
  'twicpics',
  'storyblok',
  'vercel'
]

export const providerSetup: Record<string, ProviderSetup> = {
  // https://vercel.com/docs/more/adding-your-framework#images
  async vercel (_providerOptions, moduleOptions, nuxt) {
    const imagesConfig = resolve(nuxt.options.rootDir, '.vercel_build_output/config/images.json')
    await mkdirp(dirname(imagesConfig))
    await writeJson(imagesConfig, {
      domains: moduleOptions.domains,
      sizes: Array.from(new Set(Object.values(moduleOptions.screens || {})))
    })
  }
}

export function resolveProviders (nuxt: any, options: ModuleOptions): ImageModuleProvider[] {
  const providers: ImageModuleProvider[] = []

  for (const key in options) {
    if (BuiltInProviders.includes(key)) {
      providers.push(resolveProvider(nuxt, key, { provider: key, options: options[key] }))
    }
  }

  for (const key in options.providers) {
    providers.push(resolveProvider(nuxt, key, options.providers[key]))
  }

  return providers
}

export function resolveProvider (nuxt: any, key: string, input: InputProvider): ImageModuleProvider {
  if (typeof input === 'string') {
    input = { name: input }
  }

  if (!input.name) {
    input.name = key
  }

  if (!input.provider) {
    input.provider = input.name
  }

  input.provider = BuiltInProviders.includes(input.provider)
    ? require.resolve('./runtime/providers/' + input.provider)
    : nuxt.resolver.resolvePath(input.provider)

  const setup = input.setup || providerSetup[input.name]

  return <ImageModuleProvider> {
    ...input,
    setup,
    runtime: normalize(input.provider!),
    importName: `${key}Runtime$${hash(input.provider!, 4)}`,
    runtimeOptions: input.options
  }
}

const providerFlags = {
  vercel: [process.env.VERCEL, process.env.NUXT_ENV_VERCEL_ENV, process.env.NOW_BUILDER].some(Boolean)
}

export function detectProvider (userInput?: string) {
  if (process.env.NUXT_IMAGE_PROVIDER) {
    return process.env.NUXT_IMAGE_PROVIDER
  }

  if (userInput && userInput !== 'auto') {
    for (const [provider, enabled] of Object.entries(providerFlags)) {
      if (userInput === provider && !enabled) {
        return 'static'
      }
    }
    return userInput
  }

  return 'static'
}
