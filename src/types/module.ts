import type { IPXOptions } from 'ipx'
import type { ImageOptions, CreateImageOptions, ImageModifiers } from './image'

// eslint-disable-next-line no-use-before-define
export type ProviderSetup = (providerOptions: ImageModuleProvider, moduleOptions: ModuleOptions, nuxt: any)
  => void | Promise<void>

export interface InputProvider<T = any> {
  name?: string
  provider?: string
  options?: T
  setup?: ProviderSetup
}

export interface CloudinaryModifiers extends ImageModifiers {
  format: string
  quality: string
  background: string
  rotate: 'auto_right' | 'auto_left' | 'ignore' | 'vflip' | 'hflip' | number
  roundCorner: string
  gravity: string
  effect: string
  color: string
  flags: string
  dpr: string
  opacity: number
  overlay: string
  underlay: string
  transformation: string
  zoom: number
  colorSpace: string
  customFunc: string
  density: number
}

export interface CloudinaryOptions {
  baseURL: string
  modifiers: Partial<CloudinaryModifiers>
  [key: string]: any
}

export interface ImageProviders {
  cloudinary?: Partial<CloudinaryOptions>
  contentful?: any
  cloudimage?: any
  fastly?: any
  glide?: any
  gumlet?: any
  imagekit?: any
  imgix?: any
  prismic?: any
  twicpics?: any
  storyblok?: any,
  strapi?: any,
  imageengine?: any,
  ipx?: Partial<IPXOptions>
  static?: Partial<IPXOptions>
}

// TODO: use types from CreateImageOptions
export interface ModuleOptions extends ImageProviders {
  staticFilename: string,
  provider: CreateImageOptions['provider']
  presets: { [name: string]: ImageOptions }
  dir: string
  domains: string[]
  sharp: any
  alias: Record<string, string>
  screens: CreateImageOptions['screens'],
  internalUrl: string
  providers: { [name: string]: InputProvider | any } & ImageProviders
  [key: string]: any
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
