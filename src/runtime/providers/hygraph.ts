import { joinURL } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'

type ImageOptimizations = {
  width?: number
  height?: number
  fit?: string | 'clip' | 'crop' | 'scale' | 'max'
  format?: string | 'jpg' | 'png' | 'webp' | 'avif' | 'auto_image'
  quality?: number
}

export function getImageFormat(format?: string) {
  let result = 'auto_image'

  if (format && format !== 'auto_image') {
    result = `output=format:${format}`
  }

  return result
}

export function optimizeHygraphImage(baseURL: string, url: string, optimizations: ImageOptimizations) {
  baseURL = baseURL.replace(/\/+$/, '')
  const imageId = url.split(`${baseURL}/`)[1]
  const imageFormat = getImageFormat(optimizations.format)
  const optimBase = 'resize'
  const quality = optimizations.quality ? `quality=value:${optimizations.quality}/compress=metadata:true/` : ''

  const optimList = []
  for (const [key, value] of Object.entries(optimizations)) {
    if (key !== 'format' && key !== 'quality' && value !== undefined) {
      if (key === 'fit' && value === 'contain') {
        optimList.push('fit:max')
      }
      else {
        optimList.push(`${key}:${value}`)
      }
    }
  }

  const optim = `${optimBase}=${optimList.join(',')}`
  const result = joinURL(baseURL, optim, quality, imageFormat, imageId)

  return result
}

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL } = {},
) => {
  const {
    width,
    height,
    fit,
    format,
    quality,
  } = modifiers

  if (!baseURL) {
    throw new Error('No Hygraph image base URL provided.')
  }

  return {
    url: optimizeHygraphImage(baseURL, src, { width, height, fit, format, quality }),
  }
}
