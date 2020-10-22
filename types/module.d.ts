import { Module } from '@nuxt/types'
import { ImagePreset } from './runtime'

export interface ModuleOptions {
  defaultProvider: string;
  presets: ImagePreset[],
  providers: {
    local: {
      dir?: string
      clearCache?: boolean | string;
      placeholder: {
        type: 'image' | 'sqip',
        encode: 'base64' | 'url'
      }
    }
    [name: string]: any
  }
  intersectOptions: object;
}

export const imageModule: Module<ModuleOptions>
