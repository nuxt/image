// https://docs.directus.io/reference/files/#requesting-a-thumbnail

import { joinURL, encodeQueryItem, encodePath, withBase } from 'ufo'
import { ProviderGetImage } from 'src'
import { createOperationsGenerator } from '~image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'width',
    height: 'height',
    fit: 'fit',
    format: 'format',
    quality: 'quality',
    withoutEnlargement: 'withoutEnlargement',
    transforms: 'transforms'
  },
  valueMap: {
    fit: {
      inside: 'inside',
      outside: 'outside',
      cover: 'cover',
      contain: 'contain'
    },
    format: {
      jpeg: 'jpg'
    }
  },
  joinWith: '&',
  formatter: (key, val) => encodeQueryItem(key, val)
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  const params = operationsGenerator(modifiers)

  return {
    url: withBase(joinURL('/assets/', encodePath(src) + (params ? '?' + params : '')), baseURL)
  }
}
