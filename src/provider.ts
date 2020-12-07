import { normalize } from 'upath'
import type { ModuleOptions } from './module'
import { hash } from './utils'
import * as PROVIDERS from './providers'

export interface Provider {
  runtime: string
  runtimeOptions: any
}

export type ProviderFactory = (options: any) => Provider

export interface ImageProvider {
  name: string
  importName: string
  options: any
  provider: ProviderFactory
  runtime: string
  runtimeOptions: any
}

export interface InputProvider {
  name?: string
  provider: string | ProviderFactory
  options?: any
}

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
