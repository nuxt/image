import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from '../module'
import type { IPXRuntimeConfig } from '../ipx'
import type { ImageModifiers } from './image'

// eslint-disable-next-line no-use-before-define
export type ProviderSetup = (providerOptions: ImageModuleProvider, moduleOptions: ModuleOptions, nuxt: Nuxt)
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
  aspectRatio: string
}

export interface CloudinaryOptions {
  baseURL: string
  modifiers: Partial<CloudinaryModifiers>
  [key: string]: any
}

export interface UploadcareModifiers extends ImageModifiers {
  // Image Compression
  format: 'jpeg' | 'png' | 'webp' | 'auto'
  quality: 'smart' | 'smart_retina' | 'normal' | 'better' | 'best' | 'lighter' | 'lightest'
  progressive: 'yes' | 'no'
  strip_meta: 'all' | 'none' | 'sensitive'
  // Image Geometry
  preview: `${number}x${number}`
  resize: `${number}x${number}` | `${number}x` | `x${number}`
  smart_resize: `${number}x${number}`
  crop: string | string[]
  scale_crop: string | string[]
  border_radius: string | string[]
  setfill: string // 3, 6 or 8 digit hex color
  zoom_objects: string // 1 to 100
}

export interface UploadcareOptions {
  cdnURL: string
  modifiers: Partial<UploadcareModifiers>
  [key: string]: any
}

export interface ImageProviders {
  cloudflare?: any
  cloudinary?: Partial<CloudinaryOptions>
  contentful?: any
  cloudimage?: any
  sirv?: any
  fastly?: any
  glide?: any
  gumlet?: any
  imagekit?: any
  imgix?: any
  layer0?: any
  edgio?: any
  prismic?: any
  twicpics?: any
  storyblok?: any,
  wagtail?: any,
  strapi?: any,
  imageengine?: any,
  uploadcare?: Partial<UploadcareOptions>,
  ipx?: Partial<IPXRuntimeConfig>
  static?: Partial<IPXRuntimeConfig>
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
