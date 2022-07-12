import { promises as fsp } from 'fs'
import { normalize, resolve, dirname } from 'pathe'
import { createResolver, resolvePath } from '@nuxt/kit'
import { hash } from 'ohash'
import type { InputProvider, ImageModuleProvider, ProviderSetup } from './types'
import type { ModuleOptions } from './module'
import { ipxSetup } from './ipx'

const BuiltInProviders = [
  'cloudflare',
  'cloudinary',
  'contentful',
  'cloudimage',
  'fastly',
  'glide',
  'imagekit',
  'gumlet',
  'imgix',
  'ipx',
  'netlify',
  'layer0',
  'prismic',
  'sanity',
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
  async vercel (_providerOptions, moduleOptions, nuxt) {
    const imagesConfig = resolve(nuxt.options.rootDir, '.vercel_build_output/config/images.json')
    await fsp.mkdir(dirname(imagesConfig), { recursive: true })
    await fsp.writeFile(imagesConfig, JSON.stringify({
      domains: moduleOptions.domains,
      sizes: Array.from(new Set(Object.values(moduleOptions.screens || {})))
    }, null, 2))
  }
}

export async function resolveProviders (nuxt: any, options: ModuleOptions): Promise<ImageModuleProvider[]> {
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

export async function resolveProvider (_nuxt: any, key: string, input: InputProvider): Promise<ImageModuleProvider> {
  if (typeof input === 'string') {
    input = { name: input }
  }

  if (!input.name) {
    input.name = key
  }

  if (!input.provider) {
    input.provider = input.name
  }

  const resolver = createResolver(import.meta.url)
  input.provider = BuiltInProviders.includes(input.provider)
    ? await resolver.resolve('./runtime/providers/' + input.provider)
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

export function detectProvider (userInput?: string) {
  if (process.env.NUXT_IMAGE_PROVIDER) {
    return process.env.NUXT_IMAGE_PROVIDER
  }

  if (userInput && userInput !== 'auto') {
    return userInput
  }

  if (process.env.VERCEL || process.env.VERCEL_ENV || process.env.NOW_BUILDER) {
    return 'vercel'
  }

  return 'ipx'
}
