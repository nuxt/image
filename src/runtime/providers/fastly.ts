import { joinURL } from 'ufo'
import type { ProviderGetImage } from '../../module'
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
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? ('?' + operations) : '')),
  }
}
