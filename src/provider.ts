import { normalize } from 'upath'
import type { ModuleOptions, ImageProvider, ProviderFactory, InputProvider } from './types'
import { hash } from './utils'
import * as PROVIDERS from './providers'

export function resolveProviders (nuxt, options: ModuleOptions): ImageProvider[] {
  const providers: ImageProvider[] = []

  for (const key in options) {
    if (PROVIDERS[key]) {
      providers.push(resolveProvider(nuxt, key, { provider: PROVIDERS[key], options: options[key] }))
    }
  }

  for (const key in options.providers) {
    providers.push(resolveProvider(nuxt, key, options.providers[key]))
  }

  return providers
}

export function resolveProvider (nuxt: any, key: string, input: InputProvider): ImageProvider {
  if (!input.name) {
    input.name = key
  }

  if (!input.provider) {
    input.provider = input.name
  }

  if (typeof input.provider === 'string') {
    input.provider = (PROVIDERS[input.provider] || nuxt.resolver.requireModule(input.provider)) as ProviderFactory
  }

  if (typeof input.provider !== 'function') {
    throw new TypeError(`Invalid provider: ${input.provider}. Function expected but got ${typeof input.provider}.`)
  }

  const { runtime, runtimeOptions = {} } = input.provider(input.options)

  // TODO: Check existence of runtime

  return <ImageProvider> {
    ...input,
    runtime: normalize(runtime),
    importName: `${key}Runtime$${hash(runtime, 4)}`,
    runtimeOptions
  }
}
