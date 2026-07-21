import { joinURL } from 'ufo'
import type { ImageModifiers } from '@nuxt/image'
import { defineProvider } from '../utils/provider'

interface EdgeOnePagesModifiers extends ImageModifiers {
  /** Regular crop: '<width>x<height>' e.g. '300x400' */
  crop: string
  /** Crop/scale gravity: center, north, south, west, east, northwest, northeast, southwest, southeast */
  gravity: string
  /** Crop X offset */
  dx: number
  /** Crop Y offset */
  dy: number
  /** Inscribed circle crop radius */
  iradius: number
  /** Smart face crop: '<width>x<height>' */
  scrop: string
  /** Clockwise rotation angle 0-360 */
  rotate: number
  /** Auto-rotate based on EXIF orientation */
  autoOrient: boolean
  /** Sharpen intensity */
  sharpen: number
  /** Strip EXIF metadata */
  strip: boolean
  /** Progressive display (JPEG/GIF) */
  interlace: boolean | number
  /** Pad mode (used with thumbnail + background) 0 or 1 */
  pad: boolean | number
}

/** Options for the EdgeOne Pages image provider. */
export interface EdgeOnePagesOptions {
  /** Base URL of the EdgeOne Pages site (e.g. `https://domain`). */
  baseURL: string
  /** Optional image processing modifiers. */
  modifiers?: Partial<EdgeOnePagesModifiers>
}

const fitMap: Record<string, string> = {
  contain: '',
  cover: 'r',
  fill: '!',
  inside: '',
  outside: 'r',
}

/**
 * Encode a hex color to the URL-safe Base64 form imageMogr2's `color`
 * parameter expects. The leading `#` is dropped: the API wants the bare
 * RGB hex (e.g. `ff0000`), not `#ff0000`.
 */
function encodeColor(color: string): string {
  const hex = color.startsWith('#') ? color.slice(1) : color
  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(hex).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
  return Buffer.from(hex).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * EdgeOne Pages image provider.
 *
 * Transforms images via the `imageMogr2` API, supporting resize,
 * crop, rotate, blur, quality, format conversion and more.
 *
 * @see https://edgeone.ai/document/162498
 */
export default defineProvider<EdgeOnePagesOptions>({
  getImage: (src, { modifiers = {}, baseURL }) => {
    if (!baseURL) {
      throw new Error('EdgeOne Pages provider requires baseURL to be set')
    }

    const {
      width,
      height,
      fit,
      quality,
      format,
      background,
      blur,
      crop,
      gravity,
      dx,
      dy,
      iradius,
      scrop,
      rotate,
      autoOrient,
      sharpen,
      strip,
      interlace,
      pad,
    } = modifiers as Partial<EdgeOnePagesModifiers>

    const operations: string[] = []

    if (width || height) {
      const w = width ?? ''
      const h = height ?? ''
      const fitSuffix = fit ? (fitMap[fit] ?? '') : ''

      if (fitSuffix === 'r') {
        operations.push(`thumbnail/!${w}x${h}r`)
      }
      else if (fitSuffix === '!') {
        operations.push(`thumbnail/${w}x${h}!`)
      }
      else {
        operations.push(`thumbnail/${w}x${h}`)
      }
    }

    if (pad || (background && (width || height))) {
      operations.push('pad/1')
      if (background) {
        operations.push(`color/${encodeColor(background)}`)
      }
    }

    if (crop) {
      operations.push(`crop/${crop}`)
      if (gravity) {
        operations.push(`gravity/${gravity}`)
      }
      if (typeof dx !== 'undefined') {
        operations.push(`dx/${dx}`)
      }
      if (typeof dy !== 'undefined') {
        operations.push(`dy/${dy}`)
      }
    }

    if (typeof iradius !== 'undefined') {
      operations.push(`iradius/${iradius}`)
    }

    if (scrop) {
      operations.push(`scrop/${scrop}`)
    }

    if (typeof rotate !== 'undefined') {
      operations.push(`rotate/${rotate}`)
    }

    if (autoOrient) {
      operations.push('auto-orient')
    }

    if (typeof quality !== 'undefined') {
      operations.push(`quality/${quality}`)
    }

    if (format) {
      const mappedFormat = format === 'jpeg' ? 'jpg' : format
      operations.push(`format/${mappedFormat}`)
    }

    if (typeof blur !== 'undefined' && blur) {
      operations.push(`blur/${blur}x${blur}`)
    }

    if (typeof sharpen !== 'undefined') {
      operations.push(`sharpen/${sharpen}`)
    }

    if (strip) {
      operations.push('strip')
    }

    if (interlace) {
      operations.push(`interlace/${typeof interlace === 'number' ? interlace : 1}`)
    }

    const query = operations.length ? `?imageMogr2/${operations.join('/')}` : ''

    return {
      url: joinURL(baseURL, src + query),
    }
  },
})
