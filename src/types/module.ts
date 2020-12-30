import type { ImageOptions } from './image'

export interface Provider {
  runtime: string
  runtimeOptions: any
}

export type ProviderFactory = (options: any) => Provider

export interface InputProvider {
  name?: string
  provider?: string | ProviderFactory
  options?: any
  baseURL?: string
}

export interface ImageProviders {
  cloudinary?: InputProvider,
  fastly?: InputProvider,
  imagekit?: InputProvider,
  imgix?: InputProvider,
  twicpics?: InputProvider,
  storyblok?: InputProvider
}

export interface ModuleOptions extends ImageProviders {
  provider: string
  presets: Partial<ImageOptions>[]
  local: {
    baseURL: string
    dir: string
    clearCache: boolean | string
    cacheDir: string
    accept: string[]
    sharp: { [key: string]: any }
  }
  sizes: number[],
  internalUrl?: string
  accept: any
  intersectOptions: object

  providers: { [name: string]: InputProvider | any } & ImageProviders
}
