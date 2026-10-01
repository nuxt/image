import { BunImageError } from './utils'
import type { BunImageEncoderDefaults, BunImageFit } from './utils'

export interface BunResizeOptions {
  fit?: BunImageFit
  filter?: string
  withoutEnlargement?: boolean
  background?: { r: number, g: number, b: number, alpha: number }
}

export interface BunImage {
  resize: (width: number, height?: number, options?: BunResizeOptions) => this
  rotate: (degrees: number) => this
  flip: () => this
  flop: () => this
  modulate: (options: { brightness?: number, saturation?: number }) => this
  jpeg: (options?: Record<string, unknown>) => this
  png: (options?: Record<string, unknown>) => this
  webp: (options?: Record<string, unknown>) => this
  avif: (options?: Record<string, unknown>) => this
  heic: (options?: Record<string, unknown>) => this
  blob: () => Promise<Blob>
  metadata: () => Promise<{ width: number, height: number, format: string }>
}

export interface BunImageConstructor {
  new (input: Uint8Array, options?: { maxPixels?: number, autoOrient?: boolean }): BunImage
}

export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'heic'

export const OUTPUT_FORMATS = new Set<OutputFormat>(['jpeg', 'png', 'webp', 'avif', 'heic'])

export const MIME_TYPES: Record<OutputFormat, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  heic: 'image/heic',
}

/** Formats Bun can never encode, or that failed on this machine, map here. */
export const FORMAT_FALLBACKS: Record<string, OutputFormat> = {
  avif: 'webp',
  heic: 'jpeg',
  gif: 'webp',
  tiff: 'png',
  svg: 'png',
}

const FITS = new Set<BunImageFit>(['cover', 'contain', 'fill', 'inside', 'outside'])
const FILTERS = new Set(['nearest', 'linear', 'bilinear', 'cubic', 'mitchell', 'lanczos2', 'lanczos3', 'mks2013', 'mks2021', 'box'])
const DEFAULT_MAX_OUTPUT_DIMENSION = 8192

/** Normalise an ipx format name to a Bun output format, or `undefined` if Bun has no encoder for it. */
export function normalizeFormat(input?: string): { format?: OutputFormat, requested?: string } {
  if (!input) {
    return {}
  }
  const name = input.toLowerCase()
  const normalized = name === 'jpg' ? 'jpeg' : name === 'heif' ? 'heic' : name
  return OUTPUT_FORMATS.has(normalized as OutputFormat)
    ? { format: normalized as OutputFormat, requested: name }
    : { requested: name }
}

/**
 * Which fit modes this runtime supports natively. `fill` and `inside` always;
 * `cover`, `contain`, `outside` once Bun merges them (PR #30616). Detection is
 * synchronous and needs no image bytes: unsupported fits throw at `resize()`.
 */
export function detectNativeFits(Image: BunImageConstructor): Set<BunImageFit> {
  const fits = new Set<BunImageFit>(['fill', 'inside'])
  for (const fit of ['cover', 'contain', 'outside'] as const) {
    try {
      new Image(new Uint8Array(0)).resize(2, 2, { fit })
      fits.add(fit)
    }
    catch {
      // unsupported
    }
  }
  return fits
}

export interface ParsedModifiers {
  width?: number
  height?: number
  fit?: BunImageFit
  enlarge: boolean
  filter?: string
  quality?: number
  format?: OutputFormat
  /** Format name as requested when Bun has no encoder for it (gif, tiff, ...). */
  requestedFormat?: string
  rotate?: number
  flip: boolean
  flop: boolean
  brightness?: number
  saturation?: number
  background?: { r: number, g: number, b: number, alpha: number }
  progressive?: boolean
  lossless?: boolean
  palette?: boolean
  colors?: number
  dither?: boolean
  compressionLevel?: number
  /** Modifiers that were understood but only partially applied. */
  notes: string[]
}

type ModifierInput = Record<string, string | number | boolean | undefined>

function invalid(name: string, value: unknown, expected: string): never {
  throw new BunImageError(400, 'BUN_IMAGE_INVALID_MODIFIER', `Invalid value for modifier "${name}": ${String(value)} (expected ${expected})`)
}

function pick(modifiers: ModifierInput, ...names: string[]): { name: string, value: string | number | boolean } | undefined {
  for (const name of names) {
    const value = modifiers[name]
    if (value !== undefined) {
      return { name, value }
    }
  }
}

function toNumber(name: string, value: unknown, opts: { min?: number, max?: number, integer?: boolean } = {}): number {
  const num = typeof value === 'number' ? value : Number.parseFloat(String(value))
  if (!Number.isFinite(num)) {
    invalid(name, value, 'a number')
  }
  if (opts.integer && !Number.isInteger(num)) {
    invalid(name, value, 'an integer')
  }
  if (opts.min !== undefined && num < opts.min) {
    invalid(name, value, `at least ${opts.min}`)
  }
  if (opts.max !== undefined && num > opts.max) {
    invalid(name, value, `at most ${opts.max}`)
  }
  return num
}

function toFlag(value: unknown): boolean {
  return value === true || value === '' || value === 'true' || value === 1 || value === '1'
}

const NAMED_COLORS: Record<string, string> = {
  black: '000000',
  white: 'ffffff',
  transparent: '00000000',
}

/** Parse `#rgb`, `#rrggbb`, `#rrggbbaa`, the same without `#`, or a few names. */
export function parseColor(name: string, input: string): { r: number, g: number, b: number, alpha: number } {
  let hex = String(input).trim().toLowerCase()
  hex = NAMED_COLORS[hex] ?? hex.replace(/^#/, '')
  if (hex.length === 3 || hex.length === 4) {
    hex = hex.split('').map(c => c + c).join('')
  }
  if (!/^[0-9a-f]{6}(?:[0-9a-f]{2})?$/.test(hex)) {
    invalid(name, input, 'a hex colour such as ff0000 or ff000080')
  }
  const n = Number.parseInt(hex.slice(0, 6), 16)
  const alpha = hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, alpha }
}

export function parseModifiers(modifiers: ModifierInput): ParsedModifiers {
  const out: ParsedModifiers = { enlarge: false, flip: false, flop: false, notes: [] }

  const resize = pick(modifiers, 'resize', 's')
  if (resize) {
    const [w, h] = String(resize.value).split('x')
    if (w) {
      out.width = toNumber(resize.name, w, { min: 1, integer: true })
    }
    if (h) {
      out.height = toNumber(resize.name, h, { min: 1, integer: true })
    }
  }
  const width = pick(modifiers, 'width', 'w')
  if (width) {
    out.width = toNumber(width.name, width.value, { min: 1, integer: true })
  }
  const height = pick(modifiers, 'height', 'h')
  if (height) {
    out.height = toNumber(height.name, height.value, { min: 1, integer: true })
  }

  const fit = pick(modifiers, 'fit')
  if (fit) {
    if (!FITS.has(fit.value as BunImageFit)) {
      invalid('fit', fit.value, [...FITS].join(', '))
    }
    out.fit = fit.value as BunImageFit
  }

  const enlarge = pick(modifiers, 'enlarge')
  out.enlarge = enlarge ? toFlag(enlarge.value) : false

  const kernel = pick(modifiers, 'kernel')
  if (kernel) {
    if (!FILTERS.has(String(kernel.value))) {
      invalid('kernel', kernel.value, [...FILTERS].join(', '))
    }
    out.filter = String(kernel.value)
  }

  const quality = pick(modifiers, 'quality', 'q')
  if (quality) {
    out.quality = toNumber(quality.name, quality.value, { min: 1, max: 100, integer: true })
  }

  const format = pick(modifiers, 'format', 'f')
  if (format) {
    const normalized = normalizeFormat(String(format.value))
    out.format = normalized.format
    out.requestedFormat = normalized.requested
  }

  const rotate = pick(modifiers, 'rotate')
  if (rotate) {
    const degrees = toNumber('rotate', rotate.value, { integer: true })
    if (degrees % 90 !== 0) {
      invalid('rotate', rotate.value, 'a multiple of 90 (Bun.Image cannot rotate by arbitrary angles)')
    }
    out.rotate = ((degrees % 360) + 360) % 360
  }

  const flip = pick(modifiers, 'flip')
  out.flip = flip ? toFlag(flip.value) : false
  const flop = pick(modifiers, 'flop')
  out.flop = flop ? toFlag(flop.value) : false

  const modulate = pick(modifiers, 'modulate')
  if (modulate) {
    const [b, s, hue, lightness] = String(modulate.value).split('_')
    if (b) {
      out.brightness = toNumber('modulate.brightness', b, { min: 0 })
    }
    if (s) {
      out.saturation = toNumber('modulate.saturation', s, { min: 0 })
    }
    if (hue || lightness) {
      out.notes.push('modulate: hue and lightness are not supported by Bun.Image and were ignored')
    }
  }
  const brightness = pick(modifiers, 'brightness')
  if (brightness) {
    out.brightness = toNumber('brightness', brightness.value, { min: 0 })
  }
  const saturation = pick(modifiers, 'saturation')
  if (saturation) {
    out.saturation = toNumber('saturation', saturation.value, { min: 0 })
  }
  const grayscale = pick(modifiers, 'grayscale')
  if (grayscale && toFlag(grayscale.value)) {
    out.saturation = 0
  }

  const background = pick(modifiers, 'background', 'b')
  if (background) {
    out.background = parseColor(background.name, String(background.value))
  }

  const progressive = pick(modifiers, 'progressive')
  if (progressive) {
    out.progressive = toFlag(progressive.value)
  }
  const lossless = pick(modifiers, 'lossless')
  if (lossless) {
    out.lossless = toFlag(lossless.value)
  }
  const palette = pick(modifiers, 'palette')
  if (palette) {
    out.palette = toFlag(palette.value)
  }
  const colors = pick(modifiers, 'colors')
  if (colors) {
    out.colors = toNumber('colors', colors.value, { min: 2, max: 256, integer: true })
  }
  const dither = pick(modifiers, 'dither')
  if (dither) {
    out.dither = toFlag(dither.value)
  }
  const compressionLevel = pick(modifiers, 'compressionLevel')
  if (compressionLevel) {
    out.compressionLevel = toNumber('compressionLevel', compressionLevel.value, { min: 0, max: 9, integer: true })
  }

  return out
}

/** Clamp requested dimensions to `max`, preserving the requested aspect ratio. */
export function clampToMaxDimension(size: { width?: number, height?: number }, max: number | false): { width?: number, height?: number } {
  if (max === false || !max) {
    return size
  }
  const { width, height } = size
  const scale = Math.min(1, width ? max / width : 1, height ? max / height : 1)
  if (scale === 1) {
    return size
  }
  return {
    width: width ? Math.max(1, Math.round(width * scale)) : undefined,
    height: height ? Math.max(1, Math.round(height * scale)) : undefined,
  }
}

/** Dimensions of the box a source of `source` size scales to under `fit` without cropping or padding. */
export function fitDimensions(source: { width: number, height: number }, box: { width: number, height: number }, fit: 'inside' | 'outside', enlarge: boolean): { width: number, height: number } {
  const scaleW = box.width / source.width
  const scaleH = box.height / source.height
  let scale = fit === 'inside' ? Math.min(scaleW, scaleH) : Math.max(scaleW, scaleH)
  if (!enlarge && scale > 1) {
    scale = 1
  }
  return {
    width: Math.max(1, Math.round(source.width * scale)),
    height: Math.max(1, Math.round(source.height * scale)),
  }
}

export interface ProcessOptions {
  maxOutputDimension?: number | false
  maxPixels?: number
  defaults?: BunImageEncoderDefaults
  defaultFit?: BunImageFit
  /** Result of {@link detectNativeFits}. Defaults to `fill` and `inside` only. */
  nativeFits?: Set<BunImageFit>
  /** Shared, mutable set of output formats that failed on this machine. */
  unsupportedFormats?: Set<string>
  /** Format of the source, used when no output format is requested. */
  sourceFormat?: string
}

export interface ProcessResult {
  data: Uint8Array
  format: OutputFormat
  mimeType: string
  /** Set when the requested format could not be produced and a fallback was used. */
  fallbackFrom?: string
  /** Things that were partially applied or emulated. */
  notes: string[]
}

function isFormatUnsupportedError(error: unknown): boolean {
  return (error as { code?: string } | undefined)?.code === 'ERR_IMAGE_FORMAT_UNSUPPORTED'
}

/** Output format to use when the URL requests none. */
export function defaultOutputFormat(sourceFormat?: string): OutputFormat {
  const { format } = normalizeFormat(sourceFormat)
  return format && format !== 'avif' && format !== 'heic' ? format : 'png'
}

export async function processImage(Image: BunImageConstructor, source: Uint8Array, modifiers: ModifierInput, options: ProcessOptions = {}): Promise<ProcessResult> {
  const parsed = parseModifiers(modifiers)
  const notes = [...parsed.notes]
  const nativeFits = options.nativeFits || new Set<BunImageFit>(['fill', 'inside'])
  const unsupportedFormats = options.unsupportedFormats || new Set<string>()
  const maxOutputDimension = options.maxOutputDimension ?? DEFAULT_MAX_OUTPUT_DIMENSION

  const requested = clampToMaxDimension({ width: parsed.width, height: parsed.height }, maxOutputDimension)
  let resize: { width: number, height?: number, options: BunResizeOptions } | undefined

  const fit = parsed.fit || options.defaultFit || 'cover'
  const needsMeta = (requested.height && !requested.width)
    || (requested.width && requested.height && !nativeFits.has(fit) && fit !== 'contain')
  const meta = needsMeta ? await new Image(source, { maxPixels: options.maxPixels }).metadata() : undefined

  if (requested.width && requested.height) {
    const base: BunResizeOptions = { filter: parsed.filter, withoutEnlargement: !parsed.enlarge }
    if (nativeFits.has(fit)) {
      resize = { width: requested.width, height: requested.height, options: { ...base, fit, background: fit === 'contain' ? parsed.background : undefined } }
    }
    else if (fit === 'contain') {
      resize = { width: requested.width, height: requested.height, options: { ...base, fit: 'inside' } }
      notes.push('fit: contain emulated as inside (no padding)')
    }
    else {
      const dims = clampToMaxDimension(fitDimensions(meta!, { width: requested.width, height: requested.height }, 'outside', parsed.enlarge), maxOutputDimension)
      resize = { width: dims.width!, height: dims.height!, options: { ...base, fit: 'fill', withoutEnlargement: false } }
      notes.push(`fit: ${fit} emulated as outside (no crop)`)
    }
  }
  else if (requested.width) {
    resize = { width: requested.width, options: { filter: parsed.filter, withoutEnlargement: !parsed.enlarge } }
  }
  else if (requested.height) {
    let height = requested.height
    if (!parsed.enlarge && height > meta!.height) {
      height = meta!.height
    }
    const width = Math.max(1, Math.round(height * meta!.width / meta!.height))
    resize = { width, height, options: { filter: parsed.filter, fit: 'fill', withoutEnlargement: false } }
  }

  let format: OutputFormat = parsed.format || (parsed.requestedFormat ? FORMAT_FALLBACKS[parsed.requestedFormat] || 'png' : defaultOutputFormat(options.sourceFormat))
  let fallbackFrom = parsed.requestedFormat && parsed.requestedFormat !== format ? parsed.requestedFormat : undefined
  while (unsupportedFormats.has(format) && FORMAT_FALLBACKS[format]) {
    fallbackFrom ||= format
    format = FORMAT_FALLBACKS[format]!
  }

  const build = (target: OutputFormat) => {
    let image = new Image(source, { maxPixels: options.maxPixels })
    if (parsed.rotate) {
      image = image.rotate(parsed.rotate)
    }
    if (parsed.flip) {
      image = image.flip()
    }
    if (parsed.flop) {
      image = image.flop()
    }
    if (resize) {
      const opts: BunResizeOptions = {}
      for (const key of ['fit', 'filter', 'withoutEnlargement', 'background'] as const) {
        if (resize.options[key] !== undefined) {
          (opts as Record<string, unknown>)[key] = resize.options[key]
        }
      }
      image = image.resize(resize.width, resize.height, opts)
    }
    if (parsed.brightness !== undefined || parsed.saturation !== undefined) {
      image = image.modulate({
        ...(parsed.brightness !== undefined ? { brightness: parsed.brightness } : {}),
        ...(parsed.saturation !== undefined ? { saturation: parsed.saturation } : {}),
      })
    }
    const defaults = (options.defaults?.[target] || {}) as Record<string, unknown>
    const encoder: Record<string, unknown> = { ...defaults }
    if (target !== 'png' && parsed.quality !== undefined) {
      encoder.quality = parsed.quality
    }
    if (target === 'jpeg' && parsed.progressive !== undefined) {
      encoder.progressive = parsed.progressive
    }
    if (target === 'webp' && parsed.lossless !== undefined) {
      encoder.lossless = parsed.lossless
    }
    if (target === 'png') {
      if (parsed.compressionLevel !== undefined) {
        encoder.compressionLevel = parsed.compressionLevel
      }
      if (parsed.palette !== undefined) {
        encoder.palette = parsed.palette
      }
      if (parsed.colors !== undefined) {
        encoder.colors = parsed.colors
      }
      if (parsed.dither !== undefined) {
        encoder.dither = parsed.dither
      }
    }
    return image[target](encoder)
  }

  for (;;) {
    try {
      const blob = await build(format).blob()
      return {
        data: new Uint8Array(await blob.arrayBuffer()),
        format,
        mimeType: blob.type || MIME_TYPES[format],
        fallbackFrom,
        notes,
      }
    }
    catch (error) {
      const fallback = FORMAT_FALLBACKS[format]
      if (isFormatUnsupportedError(error) && fallback && fallback !== format) {
        unsupportedFormats.add(format)
        fallbackFrom ||= format
        format = fallback
        continue
      }
      throw error
    }
  }
}
