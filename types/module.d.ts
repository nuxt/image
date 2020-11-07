import { Module } from '@nuxt/types'
import { ImagePreset } from './runtime'

export interface ModuleOptions {
  defaultProvider: string;
  presets: ImagePreset[];
  ipx: {
    baseURL: string;
    dir?: string;
    clearCache?: boolean | string;
  }
  sizes: number[],
  internalUrl?: string
  providers: {
    [name: string]: any;
  }
  intersectOptions: object;
}

export const imageModule: Module<ModuleOptions>
