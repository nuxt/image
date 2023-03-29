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
    }
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = 'http://localhost:8055/assets' } = {}) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? ('?' + operations) : ''))
  }
}
