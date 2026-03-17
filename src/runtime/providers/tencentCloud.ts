import { joinURL } from 'ufo'
import type { ImageModifiers } from '@nuxt/image'
import { defineProvider } from '../utils/provider'

interface TencentCloudModifiers extends ImageModifiers {
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

export interface TencentCloudOptions {
  baseURL: string
  modifiers?: Partial<TencentCloudModifiers>
}

const fitMap: Record<string, string> = {
  contain: '', // /thumbnail/<W>x<H>  — scale to fit within bounds (default)
  cover: 'r', // /thumbnail/!<W>x<H>r — scale to cover minimum bounds
  fill: '!', // /thumbnail/<W>x<H>!  — force stretch to exact dimensions
  inside: '', // same as contain
  outside: 'r', // same as cover
}

function encodeCosColor(color: string): string {
  const hex = color.startsWith('#') ? color : `#${color}`
  if (typeof globalThis.btoa === 'function') {
    return globalThis.btoa(hex).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
  return Buffer.from(hex).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export default defineProvider<TencentCloudOptions>({
  getImage: (src, { modifiers = {}, baseURL }) => {
    if (!baseURL) {
      throw new Error('Tencent Cloud provider requires baseURL to be set')
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
    } = modifiers as Partial<TencentCloudModifiers>

    const operations: string[] = []

    // --- Thumbnail (resize) ---
    if (width || height) {
      const w = width ?? ''
      const h = height ?? ''
      const fitSuffix = fit ? (fitMap[fit] ?? '') : ''

      if (fitSuffix === 'r') {
        // cover / outside: !<W>x<H>r
        operations.push(`thumbnail/!${w}x${h}r`)
      }
      else if (fitSuffix === '!') {
        // fill: <W>x<H>!
        operations.push(`thumbnail/${w}x${h}!`)
      }
      else {
        // contain / inside / default: <W>x<H>
        operations.push(`thumbnail/${w}x${h}`)
      }
    }

    // --- Pad + Color (background fill) ---
    if (pad || (background && (width || height))) {
      operations.push('pad/1')
      if (background) {
        operations.push(`color/${encodeCosColor(background)}`)
      }
    }

    // --- Crop (regular crop) ---
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

    // --- iradius (inscribed circle crop) ---
    if (typeof iradius !== 'undefined') {
      operations.push(`iradius/${iradius}`)
    }

    // --- scrop (smart face crop) ---
    if (scrop) {
      operations.push(`scrop/${scrop}`)
    }

    // --- Rotate ---
    if (typeof rotate !== 'undefined') {
      operations.push(`rotate/${rotate}`)
    }

    // --- Auto-orient ---
    if (autoOrient) {
      operations.push('auto-orient')
    }

    // --- Quality ---
    if (typeof quality !== 'undefined') {
      operations.push(`quality/${quality}`)
    }

    // --- Format ---
    if (format) {
      const mappedFormat = format === 'jpeg' ? 'jpg' : format
      operations.push(`format/${mappedFormat}`)
    }

    // --- Blur (Gaussian blur) ---
    if (typeof blur !== 'undefined' && blur) {
      operations.push(`blur/${blur}x${blur}`)
    }

    // --- Sharpen ---
    if (typeof sharpen !== 'undefined') {
      operations.push(`sharpen/${sharpen}`)
    }

    // --- Strip (remove metadata) ---
    if (strip) {
      operations.push('strip')
    }

    // --- Interlace (progressive display) ---
    if (interlace) {
      operations.push(`interlace/${typeof interlace === 'number' ? interlace : 1}`)
    }

    const query = operations.length ? `?imageMogr2/${operations.join('/')}` : ''

    return {
      url: joinURL(baseURL, src + query),
    }
  },
})
