import type { ImageOptions } from './image'
import type { InputProvider } from './provider'

export interface ModuleOptions {
  provider: string
  presets: ImageOptions[]
  local: {
    baseURL: string
    dir: string
    clearCache: boolean | string
    cacheDir: string
    accept: string[]
    sharp: { [key: string]: any }
  }
  sizes: number[],
  internalUrl?: string
  providers: { [name: string]: InputProvider }
  accept: any
  intersectOptions: object
  [provider: string]: InputProvider | any
}
