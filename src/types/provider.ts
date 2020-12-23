import type { ImageOptions, RuntimeImage } from './image'

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

export type RuntimeProviderGetImage = (src: string, options: ImageOptions) => RuntimeImage

export interface RuntimeProvider {
  defaults?: any
  getImage: RuntimeProviderGetImage
}
