import { normalize, resolve, dirname } from 'upath'
import { writeJson, mkdirp } from 'fs-extra'
import { resolvePath } from '@nuxt/kit'
import { Nuxt } from '@nuxt/schema'
import { hash } from './utils'
import type { ModuleOptions, InputProvider, ImageModuleProvider, ProviderSetup } from './types'
import { ipxSetup } from './ipx'

const BuiltInProviders = [
  'cloudinary',
  'contentful',
  'fastly',
  'glide',
  'imagekit',
  'gumlet',
  'imgix',
  'ipx',
  'netlify',
  'prismic',
  'sanity',
  'static',
  'twicpics',
  'strapi',
  'storyblok',
  'unsplash',
  'vercel',
  'imageengine'
]

export const providerSetup: Record<string, ProviderSetup> = {
  // IPX
  ipx: ipxSetup,
  static: ipxSetup,

  // https://vercel.com/docs/more/adding-your-framework#images
  async vercel (_providerOptions, moduleOptions, nuxt: Nuxt) {
    const imagesConfig = resolve(nuxt.options.rootDir, '.vercel_build_output/config/images.json')
    await mkdirp(dirname(imagesConfig))
    await writeJson(imagesConfig, {
      domains: moduleOptions.domains,
      sizes: Array.from(new Set(Object.values(moduleOptions.screens || {})))
    })
  }
}

export async function resolveProviders (nuxt: Nuxt, options: ModuleOptions): Promise<ImageModuleProvider[]> {
  const providers: ImageModuleProvider[] = []

  for (const key in options) {
    if (BuiltInProviders.includes(key)) {
      providers.push(await resolveProvider(nuxt, key, { provider: key, options: options[key] }))
    }
  }

  for (const key in options.providers) {
    providers.push(await resolveProvider(nuxt, key, options.providers[key]))
  }

  return providers
}

export async function resolveProvider (_nuxt: Nuxt, key: string, input: InputProvider): Promise<ImageModuleProvider> {
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
    : await resolvePath(input.provider)

  const setup = input.setup || providerSetup[input.name]

  return <ImageModuleProvider> {
    ...input,
    setup,
    runtime: normalize(input.provider!),
    importName: `${key}Runtime$${hash(input.provider!, 4)}`,
    runtimeOptions: input.options
  }
}

export function detectProvider (userInput?: string, isStatic: boolean = false) {
  if (process.env.NUXT_IMAGE_PROVIDER) {
    return process.env.NUXT_IMAGE_PROVIDER
  }

  if (userInput && userInput !== 'auto') {
    return userInput
  }

  if (process.env.VERCEL || process.env.VERCEL_ENV || process.env.NOW_BUILDER) {
    return 'vercel'
  }

  return isStatic ? 'static' : 'ipx'
}
