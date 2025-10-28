/**
 * Image provider for Uploadcare
 * URL API reference:
 * @link https://uploadcare.com/api-refs/url-api/
 *
 * URL format: https://ucarecdn.com/:uuid/-/:operation/:params/:filename
 *
 * Operations:
 * [X] Image Compression
 * [/] Image Geometry
 * [ ] Image Overlays
 * [ ] Image Colours
 * [ ] Image Definition
 * [ ] Image Rotations
 *
 * Other stuff to think about later:
 * - Signed URLs
 * - File Groups
 */

import { joinURL, hasProtocol, withTrailingSlash } from 'ufo'
import type { ImageModifiers } from '@nuxt/image'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

export interface UploadcareModifiers extends ImageModifiers {
  // Image Compression
  format: 'jpeg' | 'png' | 'webp' | 'auto'
  quality: 'smart' | 'smart_retina' | 'normal' | 'better' | 'best' | 'lighter' | 'lightest'
  progressive: 'yes' | 'no'
  strip_meta: 'all' | 'none' | 'sensitive'
  // Image Geometry
  preview: `${number}x${number}`
  resize: `${number}x${number}` | `${number}x` | `x${number}`
  smart_resize: `${number}x${number}`
  crop: string | string[]
  scale_crop: string | string[]
  border_radius: string | string[]
  setfill: string // 3, 6 or 8 digit hex color
  zoom_objects: string // 1 to 100
  stretch: string
}

export interface UploadcareOptions {
  cdnURL: string
  modifiers: Partial<UploadcareModifiers>
}

const operationsGenerator = createOperationsGenerator({
  joinWith: '',
  formatter: (key: string, value: number | string | string[]) => `-/${key}/${Array.isArray(value) ? value.join('/') : value}/`,
})

export default defineProvider<Partial<UploadcareOptions>>({
  getImage: (uuid, { modifiers, cdnURL = 'https://ucarecdn.com' }) => {
    // If width or height is specified, use resize instead
    if (modifiers?.width || modifiers?.height) {
      modifiers.resize = `${modifiers?.width || ''}x${modifiers?.height || ''}` as `x${number}` | `${number}x${number}` | `${number}x`

      delete modifiers?.width
      delete modifiers?.height
    }

    // If fit is specified, use a different operation
    if (modifiers?.fit) {
      switch (modifiers.fit) {
        case 'cover':
          if (modifiers.resize) {
            modifiers.scale_crop = [modifiers.resize, 'center']
            delete modifiers.resize
          }
          break
        case 'contain':
          modifiers.stretch = 'off'
          break
        //   case 'fill':
        //   case 'inside':
        //   case 'outside':
        //     modifiers.crop = modifiers.smart_resize
        //     break
        default:
          modifiers.smart_resize = modifiers.resize as `${number}x${number}`
          delete modifiers.resize
          break
      }
      delete modifiers.fit
    }

    const operations = operationsGenerator(modifiers)
    const base = hasProtocol(uuid) ? '' : cdnURL
    const url = withTrailingSlash(joinURL(base, uuid, operations))
    return { url }
  },
})
