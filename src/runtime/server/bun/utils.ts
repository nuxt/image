import { imageMeta } from 'image-meta'
import type { BunUnsupportedPolicy } from '../../utils/bun-modifiers'

/**
 * Error carrying an HTTP status and a stable code, thrown by the pure parts of
 * the Bun image runtime (URL parsing, storage, pipeline). The h3 handler turns
 * it into an h3 error; keeping it framework-free keeps those modules testable
 * under plain Node.
 */
export class BunImageError extends Error {
  statusCode: number
  code: string
  /** Structured details, sent to the client in the error response body. */
  data?: Record<string, unknown>

  constructor(statusCode: number, code: string, message: string, options?: { cause?: unknown, data?: Record<string, unknown> }) {
    super(message, { cause: options?.cause })
    this.name = 'BunImageError'
    this.statusCode = statusCode
    this.code = code
    this.data = options?.data
  }
}

export function isBunImageError(error: unknown): error is BunImageError {
  return error instanceof BunImageError
}

export type BunImageFit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside'

export interface BunImageFSOptions {
  /** Directory or directories to serve local images from. */
  dir?: string | string[]
  /** `max-age` in seconds for files served from this storage. */
  maxAge?: number
  /** Allow a symlink inside `dir` to resolve outside of it. Default `false`. */
  allowSymlinksOutsideDir?: boolean
}

export interface BunImageHTTPOptions {
  /** Allowlist of hostnames remote images may be fetched from. */
  domains?: string | string[]
  /** Allow any hostname. Overrides `domains`. */
  allowAllDomains?: boolean
  /** Default `max-age` in seconds when the upstream sends no cache-control. Default `300`. */
  maxAge?: number
  /** Ignore upstream `cache-control` and always use `maxAge`. */
  ignoreCacheControl?: boolean
  /**
   * Extra `fetch` options (headers, etc.). `authorization`, `proxy-authorization`
   * and `cookie` headers are only sent over HTTPS to the requested origin, never
   * on plain HTTP or after a redirect to another origin.
   */
  fetchOptions?: RequestInit
}

export interface BunImageEncoderDefaults {
  jpeg?: { quality?: number, progressive?: boolean }
  png?: { compressionLevel?: number, palette?: boolean, colors?: number, dither?: boolean }
  webp?: { quality?: number, lossless?: boolean }
  avif?: { quality?: number }
  heic?: { quality?: number }
}

export interface BunImageRuntimeConfig {
  /** Route prefix the handler is mounted on. Default `/_bun`. */
  baseURL: string
  /** URL aliases, keys normalised to a leading slash. */
  alias?: Record<string, string>
  /** Default cache duration in seconds. Default `60`. */
  maxAge?: number
  /** Cap on output width and height. Default `8192`, `false` to disable. */
  maxOutputDimension?: number | false
  /** Passed to `new Bun.Image(bytes, { maxPixels })`. */
  maxPixels?: number
  /** Local filesystem storage, `false` to disable. */
  fs?: false | BunImageFSOptions
  /** Remote http(s) storage, `false` to disable. */
  http?: false | BunImageHTTPOptions
  /** What to do with modifiers Bun.Image cannot apply. Default `warn`. */
  unsupported?: BunUnsupportedPolicy
  /** Fit used when both width and height are requested without `fit`. Default `cover`. */
  defaultFit?: BunImageFit
  /** Per-format encoder defaults. */
  defaults?: BunImageEncoderDefaults
}

export interface ParsedImageURL {
  /** Source image id: a path relative to the public dirs, or an absolute http(s) URL. */
  id: string
  /** Modifiers keyed by name, values as strings (`''` for flag modifiers such as `flip`). */
  modifiers: Record<string, string>
}

const MODIFIER_SEP = /[&,]/g
const MODIFIER_VAL_SEP = /[:=_]/

function decode(input: string) {
  try {
    return decodeURIComponent(input)
  }
  catch {
    // keep malformed percent-encoding
    return input
  }
}

/** Strip control characters so ids and modifiers are safe to log and echo. */
export function safeString(input: unknown): string {
  return JSON.stringify(input ?? '')
    .replace(/^"|"$/g, '')
    .replace(/\\+/g, '\\')
    .replace(/\\"/g, '"')
}

/**
 * Parse `<baseURL>/<modifiers>/<id>` using the ipx URL grammar: `_` for no
 * modifiers, `&` or `,` between modifiers, `_`, `:` or `=` between a modifier
 * name and its value.
 *
 * `url` may be an absolute URL or a path; only the pathname is used.
 */
export function parseImageURL(url: string, baseURL = ''): ParsedImageURL {
  let pathname: string
  try {
    pathname = new URL(url, 'http://localhost').pathname
  }
  catch {
    throw new BunImageError(400, 'BUN_IMAGE_INVALID_URL', `Invalid URL: ${safeString(url)}`)
  }

  const base = baseURL.replace(/\/+$/, '')
  if (base && (pathname === base || pathname.startsWith(`${base}/`))) {
    pathname = pathname.slice(base.length) || '/'
  }

  const [modifiersString = '', ...idSegments] = pathname.slice(1).split('/')
  const id = safeString(decode(idSegments.join('/')))

  if (!modifiersString) {
    throw new BunImageError(400, 'BUN_IMAGE_MISSING_MODIFIERS', `Modifiers are missing: ${id}`)
  }
  if (!id || id === '/') {
    throw new BunImageError(400, 'BUN_IMAGE_MISSING_ID', `Resource id is missing: ${safeString(pathname)}`)
  }

  const modifiers: Record<string, string> = Object.create(null)
  if (modifiersString !== '_') {
    for (const part of modifiersString.split(MODIFIER_SEP)) {
      const [key = '', ...values] = part.split(MODIFIER_VAL_SEP)
      if (!key) {
        continue
      }
      modifiers[safeString(key)] = safeString(values.map(v => decode(v)).join('_'))
    }
  }

  return { id, modifiers }
}

export type SourceKind
  = | 'svg'
    | 'animated-webp'
    | 'animated-gif'
    | 'avif'
    | 'heic'
    | 'tiff'
    | 'image'
    | 'unknown'

export interface SniffedSource {
  kind: SourceKind
  /** Container format as detected by image-meta, e.g. `jpg`, `png`, `webp`, `svg`. */
  type?: string
  width?: number
  height?: number
  mimeType: string
}

const MIME_BY_TYPE: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  bmp: 'image/bmp',
  avif: 'image/avif',
  heic: 'image/heic',
  heif: 'image/heif',
  tiff: 'image/tiff',
  svg: 'image/svg+xml',
}

const HEIC_BRANDS = new Set(['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1', 'heim', 'heis'])
const AVIF_BRANDS = new Set(['avif', 'avis'])

function ascii(bytes: Uint8Array, offset: number, length: number) {
  let out = ''
  for (let i = offset; i < offset + length && i < bytes.length; i++) {
    out += String.fromCharCode(bytes[i]!)
  }
  return out
}

/** WebP: RIFF....WEBP with a VP8X chunk whose flags byte has the animation bit set. */
export function isAnimatedWebP(bytes: Uint8Array): boolean {
  return bytes.length >= 21
    && ascii(bytes, 0, 4) === 'RIFF'
    && ascii(bytes, 8, 4) === 'WEBP'
    && ascii(bytes, 12, 4) === 'VP8X'
    && (bytes[20]! & 0x02) !== 0
}

/** GIF: a NETSCAPE2.0 loop extension, or more than one image descriptor. */
export function isAnimatedGif(bytes: Uint8Array): boolean {
  if (bytes.length < 6 || ascii(bytes, 0, 3) !== 'GIF') {
    return false
  }
  let descriptors = 0
  for (let i = 13; i < bytes.length - 1; i++) {
    if (bytes[i] === 0x21 && bytes[i + 1] === 0xFF && ascii(bytes, i + 3, 11) === 'NETSCAPE2.0') {
      return true
    }
    if (bytes[i] === 0x00 && bytes[i + 1] === 0x2C) {
      descriptors++
      if (descriptors > 1) {
        return true
      }
    }
  }
  return false
}

/** ISO-BMFF `ftyp` major brand, for telling AVIF and HEIC apart. */
function isoBrand(bytes: Uint8Array): string | undefined {
  if (bytes.length >= 12 && ascii(bytes, 4, 4) === 'ftyp') {
    return ascii(bytes, 8, 4).toLowerCase()
  }
}

/**
 * Classify a source image without decoding it, so the handler can decide
 * between the Bun.Image pipeline and serving the bytes untouched.
 */
export function sniffSource(bytes: Uint8Array): SniffedSource {
  let meta: { type?: string, width?: number, height?: number } | undefined
  try {
    meta = imageMeta(bytes)
  }
  catch {
    meta = undefined
  }

  const brand = isoBrand(bytes)
  const type = meta?.type || (brand && AVIF_BRANDS.has(brand) ? 'avif' : brand && HEIC_BRANDS.has(brand) ? 'heic' : undefined)
  const mimeType = (type && MIME_BY_TYPE[type]) || 'application/octet-stream'
  const base = { type, width: meta?.width, height: meta?.height, mimeType }

  if (!type) {
    return { ...base, kind: 'unknown' }
  }
  if (type === 'svg') {
    return { ...base, kind: 'svg' }
  }
  if (type === 'webp' && isAnimatedWebP(bytes)) {
    return { ...base, kind: 'animated-webp' }
  }
  if (type === 'gif' && isAnimatedGif(bytes)) {
    return { ...base, kind: 'animated-gif' }
  }
  if (type === 'avif' || (brand && AVIF_BRANDS.has(brand))) {
    return { ...base, type: 'avif', mimeType: 'image/avif', kind: 'avif' }
  }
  if (type === 'heic' || type === 'heif' || (brand && HEIC_BRANDS.has(brand))) {
    return { ...base, kind: 'heic' }
  }
  if (type === 'tiff') {
    return { ...base, kind: 'tiff' }
  }
  return { ...base, kind: 'image' }
}
