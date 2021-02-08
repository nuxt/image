import type { IPXOptions } from 'ipx'
import type { ImageOptions, CreateImageOptions } from './image'

export interface InputProvider<T=any> {
  name?: string
  provider?: string
  options?: T
}

export interface ImageProviders {
  cloudinary?: any
  fastly?: any
  imagekit?: any
  imgix?: any
  twicpics?: any
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
