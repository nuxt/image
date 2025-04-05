import { joinURL, encodePath, encodeParam } from 'ufo'
import { defineProvider } from '../provider'
import type { IPXRuntimeConfig } from '../../ipx'
import type { ImageModifiers } from '../../types'
import { createOperationsGenerator } from '#image'

// Reference: https://github.com/unjs/ipx?tab=readme-ov-file#modifiers
// TODO: https://github.com/unjs/ipx/issues/199
export interface IPXModifiers extends Omit<ImageModifiers, 'fit' | 'format'> {
  format: 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'gif' | 'heif' | 'tiff' | 'auto' | string & {}
  fit: 'contain' | 'cover' | 'fill' | 'inside' | 'outside' | string & {}
  resize: string
  quality: number | string
  background: string
  position: string
  enlarge: true | 'true'
  kernel: 'nearest' | 'cubic' | 'mitchell' | 'lanczos2' | 'lanczos3' | string & {}
  trim: number | string
  extend: string
  extract: string
  rotate: number | string
  flip: true | 'true'
  flop: true | 'true'
  sharpen: number | string
  median: number | string
  blur: number | string
  flatten: true | 'true'
  gamma: string
  negate: true | 'true'
  normalize: true | 'true'
  threshold: number | string
  modulate: string
  tint: number | string
  grayscale: true | 'true'
  animated: true | 'true'
}

export interface IPXOptions extends Omit<IPXRuntimeConfig, 'alias'> {
  modifiers: Partial<IPXModifiers>
}

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'f',
    fit: 'fit',
    width: 'w',
    height: 'h',
    resize: 's',
    quality: 'q',
    background: 'b',
  },
  joinWith: '&',
  formatter: (key, val: string | number | boolean) => encodeParam(key) + '_' + encodeParam(val.toString()),
})

export default defineProvider<Partial<IPXOptions>>({
  validateDomains: true,
  supportsAlias: true,
  getImage: (src, { modifiers, baseURL }, ctx) => {
    if (modifiers.width && modifiers.height) {
      modifiers.resize = `${modifiers.width}x${modifiers.height}`
      delete modifiers.width
      delete modifiers.height
    }

    const params = operationsGenerator(modifiers) || '_'

    if (!baseURL) {
      baseURL = joinURL(ctx.options.nuxt.baseURL, '/_ipx')
    }

    return {
      url: joinURL(baseURL, params, encodePath(src)),
    }
  },
})
