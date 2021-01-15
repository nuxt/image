import type { AllowlistOptions, Matcher } from 'allowlist'

export interface ImageModifiers {
  width: number
  height: number
  fit: string
  format: string
  [key: string]: any
}

export interface ImageOptions {
  provider?: string,
  preset?: string,
  modifiers?: Partial<ImageModifiers>
  [key: string]: any
}

// eslint-disable-next-line no-use-before-define
export type ProviderGetImage = (src: string, options: ImageOptions, ctx: ImageCTX) => ResolvedImage

export interface ImageProvider {
  defaults?: any
  getImage: ProviderGetImage
}

export interface CreateImageOptions {
  providers: {
    [name: string]: {
      defaults: any,
      provider: ImageProvider
    }
  }
  presets: { [name: string]: ImageOptions }
  provider: string
  intersectOptions: object
  responsiveSizes: number[]
  allow: AllowlistOptions
}

export interface ImageCTX {
  options: CreateImageOptions,
  allow: Matcher<any>
  nuxtContext: {
    ssrContext: any
    cache?: any
    isDev: boolean
    isStatic: boolean
    nuxtState?: any
  }
  $img?: Function
}

export interface ImageSize {
  width: number;
  media: string;
  breakpoint: number;
  format: string;
  url: string;
}

export interface ImageInfo {
  width: number,
  height: number,
  placeholder?: string,
}

export interface ResolvedImage {
  url: string,
  format?: string
  isStatic?: boolean
  getMeta?: () => Promise<ImageInfo>
}

export interface $Image {
  (source: string, options: ImageOptions): ResolvedImage
  [preset: string]: (source: string) => any
}

export interface RuntimePlaceholder extends ImageInfo {
  url: string;
}

export type OperationFormatter = (key: string, value: string) => string

export type OperationMapper = { [key: string]: string | false } | ((key: string) => string)

export interface OperationGeneratorConfig {
  keyMap?: OperationMapper
  formatter?: OperationFormatter
  joinWith?: string
  valueMap?: {
    [key: string]: OperationMapper
  }
}

export type MapToStatic = (image: ResolvedImage) => string
