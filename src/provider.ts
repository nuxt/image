import { normalize } from 'pathe'
import { defu } from 'defu'
import type { Nuxt } from '@nuxt/schema'
import type { NitroConfig } from 'nitropack'
import { createResolver, resolvePath } from '@nuxt/kit'
import { hash } from 'ohash'
import { genSafeVariableName } from 'knitwork'
import { provider } from 'std-env'
import type { ProviderName } from 'std-env'
import type { InputProvider, ImageModuleProvider, ProviderSetup, ConfiguredImageProviders } from './types'
import type { ModuleOptions } from './module'
import { ipxSetup } from './ipx'

// Please add new providers alphabetically to the list below
export const BuiltInProviders = [
  'aliyun',
  'awsAmplify',
  'bunny',
  'builderio',
  'caisy',
  'cloudflare',
  'cloudimage',
  'cloudinary',
  'contentful',
  'directus',
  'fastly',
  'filerobot',
  'github',
  'glide',
  'gumlet',
  'hygraph',
  'imageengine',
  'imagekit',
  'imgix',
  'ipx',
  'ipxStatic',
  'netlify',
  'netlifyLargeMedia',
  'netlifyImageCdn',
  'picsum',
  'prepr',
  'none',
  'prismic',
  'sanity',
  'shopify',
  'storyblok',
  'strapi',
  'strapi5',
  'supabase',
  'twicpics',
  'unsplash',
  'uploadcare',
  'vercel',
  'wagtail',
  'weserv',
  'sirv',
] as const

const resolver = createResolver(import.meta.url)
const providerRuntime = resolver.resolve('./runtime/providers/')

export function isBuiltInProvider(provider: ImageModuleProvider) {
  return provider.provider?.startsWith(providerRuntime) ?? BuiltInProviders.includes(provider.name as 'ipx')
}

type ImageProviderName = typeof BuiltInProviders[number]

// https://docs.netlify.com/image-cdn/create-integration/
const netlifySetup: ProviderSetup = (_providerOptions, moduleOptions, nuxt: Nuxt) => {
  if (moduleOptions.domains?.length > 0) {
    nuxt.options.nitro = defu(nuxt.options.nitro, {
      netlify: {
        images: {
          remote_images: moduleOptions.domains.map(domain => `https?:\\/\\/${domain.replaceAll('.', '\\.')}\\/.*`),
        },
      },
    })
  }
}

const providerSetup: Partial<Record<ImageProviderName, ProviderSetup>> = {
  // IPX
  ipx: ipxSetup(),
  ipxStatic: ipxSetup({ isStatic: true }),

  // https://vercel.com/docs/build-output-api/v3/configuration#images
  vercel(providerOptions, moduleOptions, nuxt: Nuxt) {
    nuxt.options.nitro = defu(nuxt.options.nitro, {
      vercel: {
        config: {
          images: {
            domains: moduleOptions.domains,
            minimumCacheTTL: 60 * 5,
            sizes: Array.from(new Set(Object.values(moduleOptions.screens || {}))),
            formats: providerOptions.options?.formats ?? ['image/webp', 'image/avif'],
          },
        },
      } satisfies NitroConfig['vercel'],
    })
  },

  awsAmplify(providerOptions, moduleOptions, nuxt: Nuxt) {
    nuxt.options.nitro = defu(nuxt.options.nitro, {
      awsAmplify: {
        imageOptimization: {
          path: '/_amplify/image',
          cacheControl: 'public, max-age=300, immutable',
        },
        imageSettings: {
          sizes: Array.from(new Set(Object.values(moduleOptions.screens || {}))),
          formats: providerOptions.options?.formats ?? ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
          minimumCacheTTL: 60 * 5,
          domains: moduleOptions.domains,
          remotePatterns: [], // Provided by domains
          dangerouslyAllowSVG: false, // TODO
        },
      } satisfies NitroConfig['awsAmplify'],
    })
  },
  // https://docs.netlify.com/image-cdn/create-integration/
  netlify: netlifySetup,
  netlifyImageCdn: netlifySetup,
  netlifyLargeMedia: netlifySetup,
}

export async function resolveProviders(nuxt: any, options: ModuleOptions): Promise<ImageModuleProvider[]> {
  const providers: ImageModuleProvider[] = []

  for (const key in options) {
    if (BuiltInProviders.includes(key as ImageProviderName)) {
      providers.push(await resolveProvider(nuxt, key, { provider: key, options: options[key as keyof ConfiguredImageProviders] }))
    }
  }

  for (const key in options.providers) {
    providers.push(await resolveProvider(nuxt, key, options.providers[key]))
  }

  return providers
}

export async function resolveProvider(_nuxt: any, key: string, input: InputProvider): Promise<ImageModuleProvider> {
  if (typeof input === 'string') {
    input = { name: key, provider: input }
  }

  if (!input.name) {
    input.name = key
  }

  if (!input.provider) {
    input.provider = input.name
  }

  if (input.provider in normalizableProviders) {
    input.provider = normalizableProviders[input.provider]!()
  }

  input.provider = BuiltInProviders.includes(input.provider as ImageProviderName)
    ? resolver.resolve('./runtime/providers/' + input.provider)
    : await resolvePath(input.provider)

  const setup = input.setup || providerSetup[input.name as ImageProviderName]

  return <ImageModuleProvider> {
    ...input,
    setup,
    runtime: normalize(input.provider!),
    importName: genSafeVariableName(`${key}Runtime$${hash(input.provider)}`),
    runtimeOptions: input.options,
  }
}

const autodetectableProviders: Partial<Record<ProviderName, ImageProviderName>> = {
  aws_amplify: 'awsAmplify',
  netlify: 'netlify',
  vercel: 'vercel',
}

const normalizableProviders: Partial<Record<string, () => ImageProviderName>> = {
  netlify: () => {
    return process.env.NETLIFY_LFS_ORIGIN_URL ? 'netlifyLargeMedia' : 'netlifyImageCdn'
  },
}

export function detectProvider(userInput: string = '') {
  if (process.env.NUXT_IMAGE_PROVIDER) {
    return process.env.NUXT_IMAGE_PROVIDER as keyof ConfiguredImageProviders
  }

  if (userInput && userInput !== 'auto') {
    return userInput as keyof ConfiguredImageProviders
  }

  if (provider in autodetectableProviders) {
    return autodetectableProviders[provider] as keyof ConfiguredImageProviders
  }
}
