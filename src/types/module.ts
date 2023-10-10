import type { HTTPStorageOptions, NodeFSSOptions, IPXOptions } from 'ipx'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions } from '../module'
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

export interface UploadcareModifiers extends ImageModifiers{
  // Image Compression
  format: 'jpeg' | 'png' | 'webp' | 'auto'
  quality: 'smart' | 'smart_retina' | 'normal' | 'better' | 'best' | 'lighter' | 'lightest'
  progressive: 'yes' | 'no'
  strip_meta: 'all' | 'none' | 'sensitive'
  // Image Geometry
  preview: `${number}x${number}`
  resize: `${number}x${number}` | `${number}x`| `x${number}`
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

export interface IPXModifiers extends ImageModifiers {
  format: 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'gif' | 'heif' | 'tiff' | 'auto' | string
  fit: 'contain' | 'cover' | 'fill' | 'inside' | 'outside' | string
  resize: string
  quality: number | string
  background: string
  position: string
  enlarge: true | 'true'
  kernel: 'nearest' | 'cubic' | 'mitchell' | 'lanczos2' | 'lanczos3' | string
  trim: number | string
  extend: string
  extract: string
  rotate: number | string
  flip: true | 'true'
  flop: true | 'true'
  sharpen: number | string
  median: number | string
  blur: number | string
  flatten: true | 'true'
  gamma: string
  negate: true | 'true'
  normalize: true | 'true'
  threshold: number | string
  modulate: string
  tint: number | string
  grayscale: true | 'true'
  animated: true | 'true'
}

export interface StaticIPXOptions extends Partial<Omit<IPXOptions, 'storage' | 'httpStorage'> & { http: HTTPStorageOptions, fs: NodeFSSOptions }> {
  baseURL: string
  modifiers: Partial<IPXModifiers>
}

export interface ImageProviders {
  cloudflare?: any
  cloudinary?: Partial<CloudinaryOptions>
  contentful?: any
  cloudimage?: any
  fastly?: any
  glide?: any
  gumlet?: any
  imagekit?: any
  imgix?: any
  layer0?: any
  edgio?: any
  prismic?: any
  twicpics?: any
  storyblok?: any
  wagtail?: any
  strapi?: any
  imageengine?: any
  uploadcare?: Partial<UploadcareOptions>
  ipx?: Partial<StaticIPXOptions>
  static?: Partial<StaticIPXOptions> // TODO: rename to ipxStatic or remove this ?
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
