import { normalize } from 'upath'
import type { ModuleOptions, InputProvider } from './types'
import { hash } from './utils'

const BuiltInProviders = [
  'cloudinary',
  'fastly',
  'imagekit',
  'imgix',
  'ipx',
  'static',
  'twicpics'
]

export interface ImageModuleProvider {
  name: string
  importName: string
  options: any
  provider: string
  runtime: string
  runtimeOptions: any
}

export function resolveProviders (nuxt, options: ModuleOptions): ImageModuleProvider[] {
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

  return <ImageModuleProvider> {
    ...input,
    runtime: normalize(input.provider),
    importName: `${key}Runtime$${hash(input.provider, 4)}`,
    runtimeOptions: input.options
  }
}
