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

// -- Provider --

export type ProviderFactory = (options: any) => Provider

export interface Provider {
  runtime: string
  runtimeOptions: any
  middleware?(): ProviderServerMiddleware
}

export type ProviderServerMiddleware = (req, res, next) => void

export interface RuntimeProvider {
  // Apply provider base
  // Add additional params (like signuture)
  // Do modifier mapping
  getImage: (src: string, modifiers: ImageModifiers, providerOptions: any) => RuntimeImage
}

export interface RuntimeImage {
  url: string,
  isStatic?: boolean,
  getInfo?: () => Promise<RuntimeImageInfo>
  getPlaceholder?: () => Promise<string>
}

export interface RuntimeImageInfo {
  // width of image in pixels
  width: number,
  // height of image in pixels
  height: number,
  // size of image in bytes
  bytes?: number,
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
