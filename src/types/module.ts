import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from '../module'

export type ProviderSetup = (providerOptions: ImageModuleProvider, moduleOptions: ModuleOptions, nuxt: Nuxt)
=> void | Promise<void>

export interface InputProvider<T = any> {
  name?: string
  provider?: string
  options?: T
  setup?: ProviderSetup
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ProviderDefaults {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ConfiguredImageProviders {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ImageProviders {}

export interface ImageModuleProvider {
  name: string
  importName: string
  options: any
  provider: string
  isBuiltInProvider: boolean
  runtime: string
  runtimeOptions: any
  setup: ProviderSetup
}
