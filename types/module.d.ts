import { Module } from '@nuxt/types'
import { ImagePreset } from './runtime'

export interface ModuleOptions {
  provider: string;
  presets: ImagePreset[];
  local: {
    dir?: string;
    clearCache?: boolean | string;
    cacheDir?: string;
    accept: string[];
    sharp: {
      [key: string]: any;
    }
  }
  sizes: number[],
  internalUrl?: string
  providers: {
    [name: string]: any;
  }
  intersectOptions: object;
}

export const imageModule: Module<ModuleOptions>

export type ProviderServerMiddleware = (req, res, next) => void

export type ProviderFactory = (options: any) => Provider

export interface Provider {
  runtime: string
  runtimeOptions: any
  middleware?(): ProviderServerMiddleware
}

export interface ModuleProvider {
  name: string
  importName: string
  options: any
  provider: ProviderFactory
  runtime: string
  runtimeOptions: any
  middleware?: any
}
