import { joinURL, parseURL, withTrailingSlash } from 'ufo'
import { defineProvider } from '#image'

type ImageOptimizations = {
  width?: number
  height?: number
  fit?: string | 'clip' | 'crop' | 'scale' | 'max'
  format?: string | 'jpg' | 'png' | 'webp' | 'avif' | 'auto_image'
  quality?: number | string
}

function getImageFormat(format?: string) {
  let result = 'auto_image'

  if (format && format !== 'auto_image') {
    result = `output=format:${format}`
  }

  return result
}

const ID_RE = /([^/]+)\/?$/
const COMBINED_ID_RE = /^\/(?<baseId>[^/]+)(?:\/.*)?\/(?<imageId>[^/]+)$/

function splitUpURL(baseURL: string, url: string) {
  /**
   * https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/cltsrex89477t08unlckqx9ue
   *  - baseId: cltsj3mii0pvd07vwb5cyh1ig
   *  - imageId: cltsrex89477t08unlckqx9ue
   */
  const baseId = parseURL(baseURL).pathname.match(ID_RE)?.[1]

  if (!baseId) {
    // extract baseId from url instead
    url = url.replace(withTrailingSlash(baseURL), '/')

    const groups = url.match(COMBINED_ID_RE)?.groups
    if (!groups) {
      throw new TypeError('[nuxt] [image] [hygraph] Invalid image URL')
    }
    return groups as { baseId: string, imageId: string }
  }

  const imageId = url.match(ID_RE)?.[0]

  if (!imageId) {
    throw new TypeError('[nuxt] [image] [hygraph] Invalid image URL')
  }

  // it's already in baseURL so we can omit it here
  return { baseId: '', imageId }
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

interface HygraphOptions {
  baseURL: string
}

export default defineProvider<HygraphOptions>({
  getImage: (src, { modifiers, baseURL }) => {
    const { width, height, fit, format, quality } = modifiers

    if (!baseURL) {
      throw new Error('No Hygraph image base URL provided.')
    }

    return {
      url: optimizeHygraphImage(baseURL, src, { width, height, fit, format, quality }),
    }
  },
})
