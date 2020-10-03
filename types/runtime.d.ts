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
  generateURL: (src: string, modifiers: ImageModifiers, providerOptions: any) => { url: string, isStatic?: boolean }
}

export type RuntimeOperationFormatter = (key: string, value: string) => string

export type RuntimeOperationMapper = { [key: string]: string } | ((key: string) => string)

export interface OperationGeneratorConfig {
  keys?: RuntimeOperationMapper
  formatter?: RuntimeOperationFormatter
  joinWith?: string
  values?: {
    [key: string]: RuntimeOperationMapper
  }
}
