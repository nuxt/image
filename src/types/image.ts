import type { AllowlistOptions } from 'allowlist'

export interface ImageModifiers {
  width: number
  height: number
  fit: string
  format: string
  [key: string]: any
}

export interface ImageSize {
  width: number;
  media: string;
  breakpoint: number;
  format: string;
  url: string;
}

export interface ImageOptions {
  provider?: string,
  preset?: string,
  modifiers?: Partial<ImageModifiers>
  [key: string]: any
}

export interface ImageInfo {
  width: number,
  height: number,
  placeholder?: string,
}

export interface RuntimeImage {
  url: string,
  isStatic?: boolean,
  getMeta?: () => Promise<ImageInfo>
}

export type ProviderGetImage = (src: string, options: ImageOptions) => RuntimeImage

export interface RuntimeProvider {
  defaults?: any
  getImage: ProviderGetImage
}

export interface CreateImageOptions {
  providers: {
    [name: string]: {
      defaults: any,
      provider: RuntimeProvider
    }
  }
  presets: { [name: string]: ImageOptions }
  provider: string
  intersectOptions: object
  responsiveSizes: number[]
  allow: AllowlistOptions
}

export interface ResolvedImage {
  input: string
  image: RuntimeImage
  provider: RuntimeProvider
  preset: ImageOptions
}

export interface $Image {
  (source: string, options: ImageOptions): void
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
