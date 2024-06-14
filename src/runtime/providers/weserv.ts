import { withBase } from 'ufo'
import type { OperationGeneratorConfig, ProviderGetImage, ImageOptions } from '../../module'
import { createOperationsGenerator } from '#image'
import { createError } from '#imports'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'output',
    width: 'w',
    height: 'h',
    quality: 'q',
    background: 'bg',
    pixelDensity: 'dpr',
    trimImage: 'trim',
    sharpen: 'sharp',
    brightness: 'mod',
    saturation: 'sat',
    hue: 'hue',
    filter: 'filt',
    gamma: 'gam',
    contrast: 'con',
    blur: 'blur',
    mirror: 'flop',
    rotate: 'rot',
    mask: 'mask',
    maskTrim: 'mtrim',
    maskBackground: 'mbg',
  },
  valueMap: {
    format: {
      jpeg: 'jpg',
      jpg: 'jpg',
      png: 'png',
      webp: 'webp',
    },
    fit: {
      cover: 'cover',
      contain: 'contain',
      fill: 'fill',
      inside: 'inside',
      outside: 'outside',
    },
    filter: {
      greyscale: 'greyscale',
      sepia: 'sepia',
      negative: 'negate',
      duotone: 'duotone',
    },
    mask: {
      'circle': 'circle',
      'ellipse': 'ellipse',
      'triangle': 'triangle',
      'triangle-180': 'triangle-180',
      'pentagon': 'pentagon',
      'pentagon-180': 'pentagon-180',
      'hexagon': 'hexagon',
      'square': 'square',
      'star': 'star',
      'heart': 'heart',
    },
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`,
} as OperationGeneratorConfig)

export interface WeservOptions extends ImageOptions {
  /**
   * The url of your site that is exposed to the internet.
   */
  baseURL: string

  /**
   * The url of the weserv service.
   *
   * @default https://wsrv.nl
   */
  weservURL?: string
}

export const getImage: ProviderGetImage = (src, options: Partial<WeservOptions>) => {
  const filename = src.substring(src.lastIndexOf('/') + 1)

  if (typeof options.baseURL !== 'string' || options.baseURL.length === 0) {
    if (import.meta.dev) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'The weserv provider requires the baseURL of your website.',
        data: {
          provider: 'weserv',
          src,
          modifiers: options.modifiers,
        },
        fatal: true,
        name: 'NuxtImageError',
      })
    }
    else {
      // fall back to the original image in production
      return { url: src }
    }
  }

  // https://images.weserv.nl/docs/quick-reference.html
  const operations = operationsGenerator({
    filename,
    we: 'true',
    ...options.modifiers as Record<string, string>,
    url: withBase(src, options.baseURL),
  })
    .replace('=true', '')

  return {
    url: withBase(
      operations.length ? '?' + operations : '',
      options.weservURL ?? 'https://wsrv.nl',
    ),
  }
}
