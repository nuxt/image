import { joinURL } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

type SharpOperationMap = {
  // Image Operations https://sharp.pixelplumbing.com/api-operation/
  rotate: [angle?: number, options?: { background: Color }]
  flip: []
  flop: []
  sharpen: [sigma?: number] | [options?: { sigma?: number, m1?: number, m2?: number, x1?: number, y2?: number, y3?: number }]
  median: [size?: number]
  blur: [sigma?: number] | [options?: { sigma?: number, precision?: 'integer' | 'float' | 'approximate', minAmplitude?: number }]
  flatten: [options?: { background: Color }]
  unflatten: []
  gamma: [gamma?: number, gammaOut?: number]
  negate: [options?: { alpha?: boolean }]
  normalize: [lower?: number, upper?: number]
  normalise: [lower?: number, upper?: number] // Alias
  clahe: [options?: { width: number, height: number, maxSlope?: number }]
  convolve: [kernel: { width: number, height: number, kernel: number[], offset?: number }]
  threshold: [value?: number, options?: { grayscale?: boolean }]
  linear: [a?: number | number[], b?: number | number[]]
  recomb: [matrix: number[][]]
  modulate: [options?: {
    brightness?: number
    saturation?: number
    hue?: number
    lightness?: number
  }]

  // Color Manipulation https://sharp.pixelplumbing.com/api-colour/
  tint: [color: Color]
  grayscale: []
  greyscale: [] // Alias
  pipelineColorspace: [colorspace: SharpColorspace]
  pipelineColourspace: [colourspace: SharpColorspace] // Alias
  toColorspace: [colorspace: SharpColorspace]
  toColourspace: [colourspace: SharpColorspace] // Alias

  // Channel Manipulation https://sharp.pixelplumbing.com/api-channel/
  removeAlpha: []
  ensureAlpha: [alpha?: number]
  extractChannel: [channel: 'red' | 'green' | 'blue' | 'alpha'] // Restricting to string channel extraction to avoid complexity.
}

type SharpColorspace
  = | 'srgb'
    | 'rgb'
    | 'scrgb'
    | 'rgb16'
    | 'cmyk'
    | 'lab'
    | 'b-w'
    | string // retain advanced options for advanced users

type Color
  = | string
    | { r: number, g: number, b: number, alpha?: number }
    | { h: number, s: number, l: number, alpha?: number }
    | { h: number, s: number, v: number, alpha?: number }
    | { c: number, m: number, y: number, k: number, alpha?: number }
    | { h: number, w: number, b: number }
    | { l: number, c: number, h: number }
    | { l: number, a: number, b: number }
    | { h: number, c: number, g: number }

type KnownSharpOperation
  = {
    [K in keyof SharpOperationMap]:
    SharpOperationMap[K] extends []
      ? [K]
      : [K, ...SharpOperationMap[K]]
  }[keyof SharpOperationMap]

type CustomSharpOperation<K extends string = string>
  = K extends keyof SharpOperationMap
    ? never
    : [key: K, ...args: any[]]

type SharpOperation
  = | KnownSharpOperation
    | CustomSharpOperation

type DirectusModifiers
  = | { key: string }
    | {
      key?: never
      withoutEnlargement?: boolean
      transforms?: SharpOperation[]
    }

interface DirectusOptions {
  baseURL: string
  width?: number
  height?: number
  quality?: number
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'tiff' | 'avif'
  fit?: 'cover' | 'contain' | 'inside' | 'outside' | 'fill'
  modifiers?: DirectusModifiers
}

// HACK: See Discussion #2206
const operationsGenerator = createOperationsGenerator({
  valueMap: {
    transforms(value: SharpOperation[]) {
      return value.length > 0
        ? JSON.stringify(
            Array.from(new Set(value.map(v => JSON.stringify(v))))
              .map(v => JSON.parse(v)),
          )
        : undefined
    },
  },
})

function isKeyModifier(
  mod: DirectusModifiers | undefined,
): mod is { key: string } {
  return !!mod && 'key' in mod && typeof mod.key === 'string'
}

export default defineProvider<DirectusOptions>({
  getImage: (src, { modifiers, baseURL }) => {
    if (isKeyModifier(modifiers)) {
      return {
        url: joinURL(baseURL, src + `?key=${modifiers.key}`),
      }
    }

    const operations = operationsGenerator(modifiers)

    return {
      url: joinURL(baseURL, src + (operations ? `?${operations}` : '')),
    }
  },
})
