import type { RuntimeConfig } from '@nuxt/schema'
import type { H3Event } from 'h3'
import type { ConfiguredImageProviders, ImageProviders, ProviderDefaults } from './module'

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

type DefaultProvider = ProviderDefaults extends Record<'provider', unknown> ? ProviderDefaults['provider'] : never

type Sizes = Record<string, string | number> | string

export interface ImageOptions<TProvider extends keyof ConfiguredImageProviders = DefaultProvider> {
  provider?: TProvider
  preset?: string
  densities?: string
  modifiers?: Partial<Omit<ImageModifiers, 'format' | 'quality' | 'background' | 'fit'>>
    & ('modifiers' extends keyof ConfiguredImageProviders[TProvider] ? ConfiguredImageProviders[TProvider]['modifiers'] : Record<string, unknown>)
  sizes?: Sizes
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
  provider: (string & {}) | keyof ImageProviders
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
  <TProvider extends keyof ConfiguredImageProviders = keyof ConfiguredImageProviders>(
    source: string,
    modifiers?: ImageOptions<TProvider>['modifiers'],
    options?: ImageOptions<TProvider>
  ): ResolvedImage['url']
  options: CreateImageOptions
  getImage: <TProvider extends keyof ConfiguredImageProviders = keyof ConfiguredImageProviders>(source: string, options?: ImageOptions<TProvider>) => ResolvedImage
  getSizes: <TProvider extends keyof ConfiguredImageProviders = keyof ConfiguredImageProviders>(source: string, options?: ImageOptions<TProvider>) => ImageSizes
  getMeta: <TProvider extends keyof ConfiguredImageProviders = keyof ConfiguredImageProviders>(source: string, options?: ImageOptions<TProvider>) => Promise<ImageInfo>
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

export type DataAttributes = Record<`data-${string}`, string>
