/**
* SharpOperations
* [ ] Resize // These operations are advanced and add a lot of complexity to the code base; they are already abstracted in Directus to be simpler
* 
* [X] Image
* [X] Color
* [X] Channel
*
*/


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

function validateTransforms(
  transforms?: SharpOperation[],
): string | undefined {
  if (!transforms) return
  if (!Array.isArray(transforms)) {
    throw new TypeError('[nuxt][image][directus] transforms must be an array of tuples.')
  }
  for (let i = 0; i < transforms.length; i++) {
    const t = transforms[i]
    if (!Array.isArray(t) || t.length === 0) {
      throw new TypeError(`[nuxt][image][directus] invalid transform at index ${i}.`)
    }
    if (typeof t[0] !== 'string') {
      throw new TypeError(`[nuxt][image][directus] transform at index ${i} must start with string.`)
    }
  }
  return JSON.stringify(transforms)
}

const buildQueryParams = createOperationsGenerator({
  keyMap: (key: any) => key, // identity map for Directus keys
  formatter: (key: string, value: any) =>
    key === 'transforms' ? `transforms=${value}` : `${key}=${value}`,
})

function buildQuery(modifiers: DirectusOptions['modifiers'] = {}) {
  if ('key' in modifiers && modifiers.key) {
    return `key=${encodeURIComponent(modifiers.key)}`
  }
  const { transforms, ...rest } = modifiers as Exclude<DirectusModifiers, { key: string }>
  const validatedTransforms = validateTransforms(transforms)
  return buildQueryParams({
    ...rest,
    ...(validatedTransforms ? { transforms: validatedTransforms } : {}),
  })
}

export default defineProvider<DirectusOptions>({
  getImage: (src, { modifiers, baseURL }) => {
    console.log('modifiers: ', modifiers)
    const query = buildQuery(modifiers)
    return {
      url: joinURL(baseURL, query ? `${src}?${query}` : src),
    }
  },
})
