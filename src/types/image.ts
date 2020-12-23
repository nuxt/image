import type { AllowlistOptions, Matcher } from 'allowlist'

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
  size?: String | Partial<ImageSize>[]
  provider?: string,
  preset?: string,
  modifiers?: ImageModifiers
  [key: string]: any
}

export interface RuntimeImageInfo {
  width: number,
  height: number,
  placeholder?: string,
}

export interface RuntimeImage {
  url: string,
  isStatic?: boolean,
  getMeta?: () => Promise<RuntimeImageInfo>
}

export interface CreateImageOptions {
  providers: {
    [name: string]: {
      defaults: any,
      provider: any
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
  provider: any
  preset: ImageOptions
}

export interface $Image {
  (source: string, options: ImageOptions): void
  [preset: string]: (source: string) => any
}

export interface RuntimePlaceholder extends RuntimeImageInfo {
  url: string;
}

export type RuntimeOperationFormatter = (key: string, value: string) => string

export type RuntimeOperationMapper = { [key: string]: string | false } | ((key: string) => string)

export interface OperationGeneratorConfig {
  keyMap?: RuntimeOperationMapper
  formatter?: RuntimeOperationFormatter
  joinWith?: string
  valueMap?: {
    [key: string]: RuntimeOperationMapper
  }
}
