import { joinURL } from 'ufo'
import type { ProviderGetImage } from '../../types'
import { createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  valueMap: {
    fit: {
      fill: 'crop',
      inside: 'crop',
      outside: 'crop',
      cover: 'bounds',
      contain: 'bounds',
    },
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`,
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? ('?' + operations) : '')),
  }
}
