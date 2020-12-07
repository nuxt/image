
export interface $Image {
  (source: string, options: ImageOptions): void
  [preset: string]: (source: string) => any
}

export interface ImageModifiers {
  width: number
  height: number
  fit: string
  format: string
  [key: string]: any
}

export interface ImageOptions {
  size?: String | Partial<ImageSize>[]
  provider?: string,
  preset?: string,
  modifiers?: ImageModifiers
  [key: string]: any
}

export interface ImageSize {
  width: number;
  media: string;
  breakpoint: number;
  format: string;
  url: string;
}

export type RuntimeProviderGetImage = (src: string, options: ImageOptions) => RuntimeImage

export interface RuntimeProvider {
  defaults?: any
  getImage: RuntimeProviderGetImage
}

export interface RuntimeImage {
  url: string,
  isStatic?: boolean,
  getMeta?: () => Promise<RuntimeImageInfo>
}

export interface RuntimeImageInfo {
  width: number,
  height: number,
  placeholder?: string,
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

declare module '@nuxt/types' {
  interface Context {
    $img: $Image
  }

  interface NuxtAppOptions {
    $img: $Image
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $img: $Image
  }
}
