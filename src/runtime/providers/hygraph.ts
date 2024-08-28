import { joinURL, withoutTrailingSlash } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'

type ImageOptimizations = {
  width?: number
  height?: number
  fit?: string | 'clip' | 'crop' | 'scale' | 'max'
  format?: string | 'jpg' | 'png' | 'webp' | 'avif' | 'auto_image'
  quality?: number
}

function getImageFormat(format?: string) {
  let result = 'auto_image'

  if (format && format !== 'auto_image') {
    result = `output=format:${format}`
  }

  return result
}

function splitUpURL(baseURL: string, url: string) {
  /**
   * https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/cltsrex89477t08unlckqx9ue
   *  - baseId: cltsj3mii0pvd07vwb5cyh1ig
   *  - imageId: cltsrex89477t08unlckqx9ue
   */
  const escapedBaseURL = withoutTrailingSlash(baseURL).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  const { groups } = url.match(new RegExp(`^(?:${escapedBaseURL}/)?(?<baseId>[^/]+)/(?<imageId>[^/]+)`)) || {}

  if (!groups) {
    throw new TypeError('[nuxt] [image] [hygraph] Invalid image URL')
  }

  return groups as { baseId: string, imageId: string }
}

function optimizeHygraphImage(baseURL: string, url: string, optimizations: ImageOptimizations) {
  const { baseId, imageId } = splitUpURL(baseURL, url)
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
  const result = joinURL(baseURL, baseId, optim, quality, imageFormat, imageId)

  return result
}

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL } = {}) => {
  const { width, height, fit, format, quality } = modifiers

  if (!baseURL) {
    throw new Error('No Hygraph image base URL provided.')
  }

  return {
    url: optimizeHygraphImage(baseURL, src, { width, height, fit, format, quality }),
  }
}
