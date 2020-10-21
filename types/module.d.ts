import { Module } from '@nuxt/types'
import { ImagePreset } from './runtime'

export interface ModuleOptions {
  defaultProvider: string;
  presets: ImagePreset[],
  providers: {
    local: {
      dir?: string
      clearCache?: boolean | string;
    }
    [name: string]: any
  }
  intersectOptions: object;
}

export const imageModule: Module<ModuleOptions>
