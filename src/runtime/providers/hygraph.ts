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

export function splitUpURL(url: string, baseURL: string) {
  // Starting Image URL: https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/cltsrex89477t08unlckqx9ue

  // get Both IDs split off of the baseURL
  // -> cltsj3mii0pvd07vwb5cyh1ig/cltsrex89477t08unlckqx9ue
  const bothIds = url.split(`${baseURL}/`)[1]

  // get baseId
  // -> cltsj3mii0pvd07vwb5cyh1ig
  // @ts-expect-error fixing in separate PR
  const baseId = bothIds.split('/')[0]

  // get imageId
  // -> cltsrex89477t08unlckqx9ue
  const imageId = url.split(`/`)[url.split(`/`).length - 1]

  return {
    baseId,
    imageId,
  }
}

export function optimizeHygraphImage(baseURL: string, url: string, optimizations: ImageOptimizations) {
  baseURL = baseURL.replace(/\/+$/, '')

  const { baseId, imageId } = splitUpURL(url, baseURL)
  const imageFormat = getImageFormat(optimizations.format)
  const optimBase = 'resize'
  const quality = optimizations.quality && imageFormat !== 'auto_image' ? `quality=value:${optimizations.quality}/` : ''

  const optimList: [string?] = []
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
  // @ts-expect-error fixing in separate PR
  const result = joinURL(baseURL, baseId, optim, quality, imageFormat, imageId)

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
