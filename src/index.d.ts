import type { ImageProvider } from './types'

declare module './types' {
  interface ImageProviders {
    ipx: ReturnType<typeof import('./runtime/providers/ipx').default> extends ImageProvider<infer Options> ? Options : unknown
    none: ReturnType<typeof import('./runtime/providers/none').default> extends ImageProvider<infer Options> ? Options : unknown
    ipxStatic: ReturnType<typeof import('./runtime/providers/ipxStatic').default> extends ImageProvider<infer Options> ? Options : unknown
  }
}

export {}
