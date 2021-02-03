import type { IPXOptions } from 'ipx'
import type { ImageOptions } from './image'

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

export interface ModuleOptions extends ImageProviders {
  provider: string
  presets: { [name: string]: ImageOptions }
  dir: string
  domains: string[]
  sharp: {}
  sizes: (number|string)[],
  internalUrl: string
  intersectOptions: object
  providers: { [name: string]: InputProvider | any } & ImageProviders
}
