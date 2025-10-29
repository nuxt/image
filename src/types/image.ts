import type { RuntimeConfig } from '@nuxt/schema'
import type { H3Event } from 'h3'
import type { ConfiguredImageProviders, ProviderDefaults } from './module'

export interface ImageModifiers {
  width: number | string
  height: number | string
  fit: string
  format: string
  quality: string | number
  background: string
  blur: number
}

export interface ResolvedImageModifiers extends ImageModifiers {
  width: number
  height: number
}

export interface ImageOptions<Provider extends keyof ConfiguredImageProviders = ProviderDefaults['provider']> {
  provider?: Provider
  preset?: string
  densities?: string
  modifiers?: Partial<Omit<ImageModifiers, 'format' | 'quality' | 'background' | 'fit'>>
    & ('modifiers' extends keyof ConfiguredImageProviders[Provider] ? ConfiguredImageProviders[Provider]['modifiers'] : Record<string, unknown>)
  sizes?: string | Record<string, any>
}

export interface ImageSizesOptions extends ImageOptions {
  sizes: Record<string, string | number> | string
}

export type ProviderGetImage<T = Record<string, unknown>> = (src: string, options: Omit<ImageOptions, 'modifiers'> & { modifiers: Partial<ResolvedImageModifiers> } & T, ctx: ImageCTX) => ResolvedImage

interface ImageModifierOptions {
  modifiers?: Record<string, unknown>
}

export interface ImageProvider<T> extends ImageModifierOptions {
  defaults?: T
  getImage: ProviderGetImage<T>
  validateDomains?: boolean
  supportsAlias?: boolean
}

export interface CreateImageOptions {
  providers: Record<keyof ConfiguredImageProviders, {
    defaults: unknown
    setup: () => ImageProvider<Record<string, unknown>>
  }>
  nuxt: {
    baseURL: string
  }
  event?: H3Event
  presets: { [name: string]: ImageOptions }
  provider: string
  screens: Record<string, number>
  alias: Record<string, string>
  domains: string[]
  densities: number[]
  format: string[]
  quality?: number
  runtimeConfig: RuntimeConfig
}

export interface ImageInfo {
  width: number
  height: number
  placeholder?: string
}

export interface ResolvedImage {
  url: string
  format?: string
  getMeta?: () => Promise<ImageInfo>
}

export interface ImageSizes {
  srcset: string
  sizes: string | undefined
  src?: string
}

export interface Img {
  (source: string, modifiers?: ImageOptions['modifiers'], options?: ImageOptions): ResolvedImage['url']
  options: CreateImageOptions
  getImage: (source: string, options?: ImageOptions) => ResolvedImage
  getSizes: (source: string, options?: ImageOptions, sizes?: string[]) => ImageSizes
  getMeta: (source: string, options?: ImageOptions) => Promise<ImageInfo>
}

export type $Img = Img & {
  [preset: string]: $Img
}

export interface ImageCTX {
  options: CreateImageOptions
  $img?: $Img
}

export type OperationMapper<From, To> = Record<string | Extract<From, string | number>, To> | ((key?: From) => To | From | undefined)

export type OperationGeneratorConfig<Key extends string, Value, FinalKey, FinalValue> = {
  keyMap?: Partial<Record<Key, FinalKey>>
  valueMap?: Partial<Record<Key, Partial<Record<Extract<Value, string>, FinalValue>> | ((key: Value) => Value | FinalValue)>>
} & ({
  formatter?: (key: FinalKey, value: FinalValue) => string
  joinWith?: undefined
} | {
  formatter: (key: FinalKey, value: FinalValue) => string
  joinWith: string
})

export interface ImageSizesVariant {
  size?: string
  screenMaxWidth: number
  _cWidth: number
  _cHeight?: number | undefined
}
