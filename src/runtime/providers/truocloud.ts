import { joinURL } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

interface TruoCloudOptions {
  /** The delivery endpoint, `https://img.truo.cloud/i/<pid>`. */
  baseURL?: string
}

/**
 * Standard modifier name to the service's wire name.
 *
 * Declared separately so it can be reversed below: a source that is already a
 * TruoCloud URL carries wire names (`w`), while modifiers arrive with standard
 * names (`width`). Merging them without translating one side emits both, and
 * `?w=200&w=800` means whichever the service reads first.
 */
const keyMap = {
  width: 'w',
  height: 'h',
  format: 'f',
  quality: 'q',
  fit: 'fit',
  dpr: 'dpr',
  background: 'bg',
  rotate: 'ro',
  blur: 'blur',
  sharpen: 'sharp',
  brightness: 'bri',
  contrast: 'con',
  saturation: 'sat',
  gamma: 'gam',
  gravity: 'a',
  crop: 'crop',
  trim: 'trim',
  mask: 'mask',
  filter: 'filt',
  withoutEnlargement: 'we',
  lossless: 'll',
  progressive: 'il',
  frames: 'n',
} as const

const wireToStandard: Record<string, string> = Object.fromEntries(
  Object.entries(keyMap).map(([standard, wire]) => [wire, standard]),
)

export const operationsGenerator = createOperationsGenerator({
  keyMap,
  valueMap: {
    // The service answers `jpg`, and silently ignores a format it does not
    // know: an unmapped `jpeg` would return the source format with a 200.
    format: {
      jpeg: 'jpg',
      jpg: 'jpg',
      png: 'png',
      webp: 'webp',
      avif: 'avif',
      gif: 'gif',
      tiff: 'tiff',
      // Negotiates from the `Accept` header, answered with `Vary: Accept`.
      auto: 'auto',
    },
  },
})

/**
 * Percent-encodes each path segment per RFC 3986.
 *
 * Not `encodeURI`, and not nothing: this path ends up inside a query parameter
 * upstream, where a raw `+` means a space and the file is not found. The strict
 * form also matches `rawurlencode`, which the CMS-side builders of this
 * contract use, so the same file produces the same URL everywhere.
 */
function encodePath(path: string): string {
  return path
    .replace(/^\/+/, '')
    .split('/')
    .map(segment =>
      encodeURIComponent(segment).replace(
        /[!'()*]/g,
        c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
      ),
    )
    .join('/')
}

/**
 * Sorts parameters by name and restores literal commas.
 *
 * Every builder of this contract sorts them, and two orderings of one request
 * are two CDN cache entries for the same image. The comma matters separately:
 * the transformation engine does not decode `%2C`, so an escaped
 * `crop=60,30,0,0` is ignored and the image comes back uncropped, with a 200.
 */
function canonicalise(query: string): string {
  if (!query) {
    return ''
  }
  return query
    .split('&')
    .sort((a, b) => (a.split('=')[0]! < b.split('=')[0]! ? -1 : 1))
    .join('&')
    .replace(/%2C/g, ',')
}

/**
 * Splits a source that is already a TruoCloud URL.
 *
 * Without this, a `src` that already points at the CDN is wrapped again into
 * `/i/<pid>/https%3A//img.truo.cloud/i/<pid>/…` — a URL that works, costs twice
 * and is unreadable in a bug report. It is the normal state of a partially
 * migrated site.
 */
function unwrap(src: string, baseURL: string) {
  const prefix = baseURL.replace(/\/+$/, '')
  if (!src.toLowerCase().startsWith(`${prefix.toLowerCase()}/`)) {
    return null
  }
  const rest = src.slice(prefix.length + 1)
  const q = rest.indexOf('?')
  if (q === -1) {
    return { path: rest, carried: {} as Record<string, string> }
  }

  const carried: Record<string, string> = {}
  for (const pair of rest.slice(q + 1).split('&')) {
    const [k, v = ''] = pair.split('=')
    // A signature covers one exact path and query and cannot be re-derived
    // here, so carrying it over would produce a URL that 403s.
    if (!k || k === 's' || k === 'exp') {
      continue
    }
    const name = decodeURIComponent(k)
    carried[wireToStandard[name] ?? name] = decodeURIComponent(v)
  }
  return { path: rest.slice(0, q), carried }
}

/**
 * Booleans travel as `1`, and `false` drops the parameter.
 *
 * `createOperationsGenerator` stringifies `true` as `'true'`, which the service
 * accepts — but the other builders of this contract emit `1`, and two spellings
 * of one request are two cache entries and two different signatures.
 */
function normaliseModifiers(modifiers: Record<string, unknown> = {}) {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(modifiers)) {
    if (value === false || value === null || value === undefined || value === '') {
      continue
    }
    out[key] = value === true ? 1 : value
  }
  return out
}

export default defineProvider<TruoCloudOptions>({
  getImage: (src, { modifiers, baseURL = 'https://img.truo.cloud' }) => {
    const existing = unwrap(src, baseURL)
    // The explicit call wins over what was glued to the URL: the caller asking
    // now knows more than the markup did.
    const merged = { ...(existing?.carried ?? {}), ...normaliseModifiers(modifiers) }
    // An already-encoded path is reused verbatim; encoding it again would turn
    // `%20` into `%2520`.
    const path = existing ? existing.path : encodePath(src)
    const query = canonicalise(operationsGenerator(merged))

    return {
      url: joinURL(baseURL, path) + (query ? `?${query}` : ''),
    }
  },
})
