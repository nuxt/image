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

export interface ModuleOptions {
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
  providers: { [name: string]: InputProvider }
  accept: any
  intersectOptions: object

  cloudinary?: InputProvider,
  fastly?: InputProvider,
  imagekit?: InputProvider,
  imgix?: InputProvider,
  twicpics?: InputProvider,

  [provider: string]: InputProvider | any
}
