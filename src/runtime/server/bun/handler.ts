import { createHash } from 'node:crypto'
import { Buffer } from 'node:buffer'
import { defineEventHandler, createError, getRequestHeader, setResponseHeader, setResponseStatus } from 'h3'
import type { EventHandler, H3Event } from 'h3'
import { withLeadingSlash } from 'ufo'
import { BunImageError, isBunImageError, parseImageURL, sniffSource } from './utils'
import type { SniffedSource, BunImageRuntimeConfig } from './utils'
import { createFSStorage, createHTTPStorage, resolveStorage } from './storage'
import type { StorageSet } from './storage'
import { detectNativeFits, processImage } from './pipeline'
import type { BunImageConstructor, OutputFormat } from './pipeline'
import { findUnsupportedBunModifiers, warnUnsupportedBunModifiers } from '../../utils/bun-modifiers'

export interface BunImageHandlerOptions {
  /** Override the storages built from `config.fs` / `config.http` (tests). */
  storages?: StorageSet
  /** Where warnings go. Default `console.warn`. */
  log?: (message: string) => void
}

const DEFAULT_MAX_AGE = 60

function setHeaderIfUnset(event: H3Event, name: string, value: string) {
  if (!event.node.res.getHeader(name)) {
    setResponseHeader(event, name, value)
  }
}

function etagMatches(ifNoneMatch: string | undefined, etag: string): boolean {
  if (!ifNoneMatch) {
    return false
  }
  if (ifNoneMatch === '*') {
    return true
  }
  const opaque = (tag: string) => tag.trim().replace(/^W\//, '')
  return ifNoneMatch.split(',').some(tag => opaque(tag) === opaque(etag))
}

/** Weak ETag from everything that determines the response, without reading the image. */
function weakEtag(id: string, modifiers: Record<string, string>, mtime: Date): string {
  const key = JSON.stringify([mtime.getTime(), id, Object.keys(modifiers).sort().map(k => [k, modifiers[k]])])
  return `W/"${createHash('sha256').update(key).digest('base64url').slice(0, 27)}"`
}

/** Pick an output format for `f_auto` from the Accept header. */
export function negotiateFormat(accept: string | undefined, unsupportedFormats: Set<string>): OutputFormat | undefined {
  const accepted = (accept || '').toLowerCase()
  if (accepted.includes('image/avif') && !unsupportedFormats.has('avif')) {
    return 'avif'
  }
  if (accepted.includes('image/webp')) {
    return 'webp'
  }
}

/** Sources Bun.Image cannot decode, or that must not be re-encoded, are served untouched. */
function isPassthrough(source: SniffedSource, modifiers: Record<string, string>, undecodable: Set<string>): boolean {
  if (source.kind === 'svg' || source.kind === 'animated-webp' || source.kind === 'unknown') {
    return true
  }
  if (source.kind === 'animated-gif' && ('animated' in modifiers || 'a' in modifiers)) {
    return true
  }
  return undecodable.has(source.kind)
}

export function createBunImageHandler(config: BunImageRuntimeConfig, Image: BunImageConstructor, handlerOptions: BunImageHandlerOptions = {}): EventHandler {
  const log = handlerOptions.log || ((message: string) => console.warn(message))
  const storages: StorageSet = handlerOptions.storages || {
    fs: config.fs && config.fs.dir ? createFSStorage(config.fs) : undefined,
    http: config.http && (config.http.domains?.length || config.http.allowAllDomains) ? createHTTPStorage(config.http) : undefined,
  }
  if (!storages.fs && !storages.http) {
    throw new Error('[@nuxt/image] bun provider: no image storage is configured (set `image.bun.fs` or `image.bun.http`)')
  }
  storages.alias = Object.fromEntries(Object.entries(config.alias || {}).map(([key, value]) => [withLeadingSlash(key), value]))

  const nativeFits = detectNativeFits(Image)
  const unsupportedFormats = new Set<string>()
  const undecodable = new Set<string>()
  const policy = config.unsupported || 'warn'
  const warnedOnce = new Set<string>()
  const warnOnce = (key: string, message: string) => {
    if (policy !== 'silent' && !warnedOnce.has(key)) {
      warnedOnce.add(key)
      log(message)
    }
  }
  warnOnce('fits', `[@nuxt/image] bun provider: native fit modes ${[...nativeFits].join(', ')}${nativeFits.has('cover') ? '' : ' (cover, contain and outside are emulated without cropping or padding)'}`)

  return defineEventHandler(async (event) => {
    try {
      return await handle(event)
    }
    catch (error: any) {
      if (isBunImageError(error)) {
        // h3 v1 does not serialise `message`
        throw createError({ statusCode: error.statusCode, statusMessage: error.code, message: error.message, data: { message: error.message, ...error.data }, cause: error })
      }
      const code = typeof error?.code === 'string' ? error.code : ''
      if (code === 'ERR_INVALID_ARG_TYPE' || code === 'ERR_IMAGE_TOO_MANY_PIXELS' || code === 'ERR_IMAGE_UNKNOWN_FORMAT' || code === 'ERR_IMAGE_DECODE_FAILED') {
        throw createError({ statusCode: 400, statusMessage: code, message: error.message, data: { message: error.message }, cause: error })
      }
      throw error
    }
  })

  async function handle(event: H3Event) {
    const rawURL = event.node.req.url || event.path
    const parsed = parseImageURL(rawURL, config.baseURL)
    const modifiers = parsed.modifiers

    const requestedFormat = modifiers.f ?? modifiers.format
    if (requestedFormat === 'auto') {
      delete modifiers.f
      delete modifiers.format
      const negotiated = negotiateFormat(getRequestHeader(event, 'accept'), unsupportedFormats)
      if (negotiated) {
        modifiers.format = negotiated
      }
      setResponseHeader(event, 'vary', 'Accept')
    }

    const unsupported = findUnsupportedBunModifiers(modifiers)
    if (unsupported.length && policy === 'error') {
      throw new BunImageError(400, 'BUN_IMAGE_UNSUPPORTED_MODIFIER', `Modifiers not supported by the bun provider: ${unsupported.join(', ')}`, { data: { modifiers: unsupported } })
    }
    if (unsupported.length) {
      warnUnsupportedBunModifiers(parsed.id, modifiers, policy, log)
      for (const name of unsupported) {
        Reflect.deleteProperty(modifiers, name)
      }
    }

    const { id, storage } = resolveStorage(parsed.id, storages)
    const source = await storage.resolve(id)

    setHeaderIfUnset(event, 'content-security-policy', 'default-src \'none\'')
    setHeaderIfUnset(event, 'x-content-type-options', 'nosniff')

    const maxAge = source.maxAge ?? config.maxAge ?? DEFAULT_MAX_AGE
    setHeaderIfUnset(event, 'cache-control', `max-age=${maxAge}, public, s-maxage=${maxAge}`)

    const ifNoneMatch = getRequestHeader(event, 'if-none-match')
    if (source.mtime) {
      setHeaderIfUnset(event, 'last-modified', source.mtime.toUTCString())
      const ifModifiedSince = getRequestHeader(event, 'if-modified-since')
      if (ifModifiedSince && new Date(ifModifiedSince) >= source.mtime) {
        setResponseStatus(event, 304)
        return ''
      }
      const etag = weakEtag(id, modifiers, source.mtime)
      setHeaderIfUnset(event, 'etag', etag)
      if (etagMatches(ifNoneMatch, etag)) {
        setResponseStatus(event, 304)
        return ''
      }
    }

    const data = await source.read()
    const sniffed = sniffSource(data)

    if (isPassthrough(sniffed, modifiers, undecodable)) {
      return passthrough(event, id, data, sniffed, modifiers)
    }

    // OS codec formats: probe once per kind
    if (sniffed.kind === 'avif' || sniffed.kind === 'heic' || sniffed.kind === 'tiff') {
      try {
        await new Image(data, { maxPixels: config.maxPixels }).metadata()
      }
      catch (error: any) {
        if (error?.code === 'ERR_IMAGE_FORMAT_UNSUPPORTED') {
          undecodable.add(sniffed.kind)
          return passthrough(event, id, data, sniffed, modifiers)
        }
        throw error
      }
    }

    const result = await processImage(Image, data, modifiers, {
      maxOutputDimension: config.maxOutputDimension,
      maxPixels: config.maxPixels,
      defaults: config.defaults,
      defaultFit: config.defaultFit,
      nativeFits,
      unsupportedFormats,
      sourceFormat: sniffed.type,
    })

    if (result.fallbackFrom) {
      warnOnce(`format:${result.fallbackFrom}`, `[@nuxt/image] bun provider: cannot encode "${result.fallbackFrom}" on this machine, serving "${result.format}" instead (first seen for "${id}")`)
    }
    for (const note of result.notes) {
      warnOnce(`note:${note}`, `[@nuxt/image] bun provider: ${note} (first seen for "${id}")`)
    }

    if (!source.mtime) {
      const etag = `"${createHash('sha256').update(result.data).digest('base64url').slice(0, 27)}"`
      setHeaderIfUnset(event, 'etag', etag)
      if (etagMatches(ifNoneMatch, etag)) {
        setResponseStatus(event, 304)
        return ''
      }
    }
    setHeaderIfUnset(event, 'content-type', result.mimeType)
    return Buffer.from(result.data.buffer, result.data.byteOffset, result.data.byteLength)
  }

  function passthrough(event: H3Event, id: string, data: Uint8Array, sniffed: SniffedSource, modifiers: Record<string, string>) {
    if (Object.keys(modifiers).some(name => name !== 'animated' && name !== 'a')) {
      warnOnce(`passthrough:${sniffed.kind}`, `[@nuxt/image] bun provider: ${describeKind(sniffed)} sources are served unmodified, modifiers were ignored (first seen for "${id}")`)
    }
    setHeaderIfUnset(event, 'content-type', sniffed.mimeType)
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength)
  }
}

function describeKind(source: SniffedSource): string {
  switch (source.kind) {
    case 'svg': return 'SVG'
    case 'animated-webp': return 'animated WebP'
    case 'animated-gif': return 'animated GIF'
    case 'avif': return 'AVIF (no decoder on this machine)'
    case 'heic': return 'HEIC (no decoder on this machine)'
    case 'tiff': return 'TIFF (no decoder on this machine)'
    default: return 'unrecognised'
  }
}
