// -- $img() utility --

export interface CreateImageOptions {
  providers: {
    [name: string]: {
      defaults: any
      provider: RuntimeProvider
    }
  }
  presets: ImagePreset[]
  defaultProvider: string
  intersectOptions: object
  responsiveSizes: number[]
}

export interface $Image {
  (source: string, modifiers: ImageModifiers, options: any): void
  [preset: string]: (source: string) => any
}

// -- generic --

export interface ImagePreset {
  name: string
  modifiers: any
  provider?: string
}

export interface ImageModifiers {
  width: number
  height: number
  fit: string
  format: string
  [key: string]: any;
}

export interface ImageSize {
  width: number;
  media: string;
  breakpoint: number;
  format: string;
  url: string;
}

// -- Provider --

export interface RuntimeProvider {
  // Apply provider base
  // Add additional params (like signuture)
  // Do modifier mapping
  getImage: (src: string, modifiers: ImageModifiers, providerOptions: any) => RuntimeImage
}

export interface RuntimeImage {
  url: string,
  isStatic?: boolean,
  getMeta?: () => Promise<RuntimeImageInfo>
}

export interface RuntimeImageInfo {
  // width of image in pixels
  width: number,
  // height of image in pixels
  height: number,
  // placeholder (base64 or url)
  placeholder?: string,
}

export interface RuntimePlaceholder extends RuntimeImageInfo {
  url: string;
}

export type RuntimeOperationFormatter = (key: string, value: string) => string

export type RuntimeOperationMapper = { [key: string]: string } | ((key: string) => string)

export interface OperationGeneratorConfig {
  keyMap?: RuntimeOperationMapper
  formatter?: RuntimeOperationFormatter
  joinWith?: string
  valueMap?: {
    [key: string]: RuntimeOperationMapper
  }
}
