import { joinURL } from 'ufo'
import type { ProviderGetImage } from '../../types'
import { createOperationsGenerator } from '#image'

export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    key: 'key',
    width: 'width',
    height: 'height',
    format: 'format',
    quality: 'quality',
    fit: 'fit',
    withoutEnlargement: 'withoutEnlargement',
    transforms: 'transforms'
  },
  valueMap: {
    fit: {
      cover: 'cover',
      contain: 'contain',
      inside: 'inside',
      outside: 'outside'
    },
    format: {
      jpg: 'jpg',
      png: 'png',
      webp: 'webp',
      tiff: 'tiff'
    },
    withoutEnlargement: {
      true: 'true',
      false: 'false'
    }
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL } = {}) => {
  const operations = operationsGenerator(modifiers)
  if (baseURL !== null && !baseURL.endsWith('/assets')) {
    baseURL += '/assets'
  }
  return {
    url: joinURL(baseURL || 'http://localhost:8055/assets', src + (operations ? ('?' + operations) : ''))
  }
}
