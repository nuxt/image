import type { IPXOptions } from 'ipx'
import type { ImageOptions, CreateImageOptions } from './image'

// eslint-disable-next-line no-use-before-define
export type ProviderSetup = (providerOptions: ImageModuleProvider, moduleOptions: ModuleOptions, nuxt: any)
  => void | Promise<void>

export interface InputProvider<T = any> {
  name?: string
  provider?: string
  options?: T
  setup?: ProviderSetup
}

export interface ImageProviders {
  cloudinary?: any
  fastly?: any
  imagekit?: any
  imgix?: any
  twicpics?: any
  storyblok?: any,
  ipx?: Partial<IPXOptions>
  static?: Partial<IPXOptions>
}

// TODO: use types from CreateImageOptions
export interface ModuleOptions extends ImageProviders {
  provider: CreateImageOptions['provider']
  presets: { [name: string]: ImageOptions }
  dir: string
  domains: string[]
  sharp: {}
  screens: CreateImageOptions['screens'],
  internalUrl: string
  intersectOptions: CreateImageOptions['intersectOptions']
  providers: { [name: string]: InputProvider | any } & ImageProviders
}

export interface ImageModuleProvider {
  name: string
  importName: string
  options: any
  provider: string
  runtime: string
  runtimeOptions: any
  setup: ProviderSetup
}
