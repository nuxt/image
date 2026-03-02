import type { ImageModifiers } from '@nuxt/image'
import { joinURL, encodeQueryItem } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

export interface CloudflareImagesModifiers extends ImageModifiers {
  dpr: number
  gravity: 'auto' | 'face' | 'left' | 'right' | 'top' | 'bottom' | string
  sharpen: number
  rotate: 90 | 180 | 270
  brightness: number
  contrast: number
  gamma: number
  saturation: number
  anim: 'true' | 'false'
  metadata: 'copyright' | 'keep' | 'none'
  onerror: 'redirect'
  compression: 'fast'
  flip: 'h' | 'v' | 'hv'
  zoom: number
  segment: 'foreground'
  /**
   * The variant of the image to deliver (e.g., 'public', 'thumbnail', etc.)
   * This gets priority over other modifiers.
   * @default 'public' if no modifiers is provided
   * @see https://developers.cloudflare.com/images/cloudflare-images/image-variants/
   */
  variant: string
}

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    dpr: 'dpr',
    fit: 'fit',
    gravity: 'g',
    quality: 'q',
    format: 'f',
  },
  valueMap: {
    fit: {
      cover: 'cover',
      contain: 'contain',
      fill: 'pad',
      outside: 'crop',
      inside: 'scale-down',
    },
    gravity: {
      auto: 'auto',
      left: 'left',
      right: 'right',
      top: 'top',
      bottom: 'bottom',
      face: 'face',
    },
    format: {
      auto: 'auto',
      avif: 'avif',
      webp: 'webp',
      jpeg: 'jpeg',
      png: 'png',
      json: 'json',
    },
  },
  joinWith: ',',
  formatter: (key, val) => encodeQueryItem(key, val),
})

export interface CloudflareImagesOptions {
  baseURL?: string
  accountHash: string
  modifiers?: Partial<CloudflareImagesModifiers>
}

export default defineProvider<CloudflareImagesOptions>({
  getImage(imageId: string, { modifiers = {}, baseURL = 'https://imagedelivery.net/', accountHash }) {
    const { variant, ...restModifiers } = modifiers

    if (Object.keys(restModifiers).length === 0 || variant) {
      return {
        url: joinURL(baseURL, accountHash, imageId, variant ?? 'public'),
      }
    }

    const operations = operationsGenerator(restModifiers)

    return {
      url: joinURL(baseURL, accountHash, imageId, operations),
    }
  },
})
