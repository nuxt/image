import type { RuntimeProviderGetImage } from 'src'
import { createOperationsGenerator } from '@nuxt/image/runtime'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    format: 'fm'
  },
  valueMap: {
    fit: {
      fill: 'scale',
      inside: 'fit-max',
      outside: 'fit-min',
      cover: 'crop',
      contain: 'fill'
    }
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`
})

export const getImage: RuntimeProviderGetImage = (src, { modifiers, baseURL }) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: baseURL + src + '?' + operations
  }
}
