import { joinURL } from 'ufo'
import type { ProviderGetImage } from '../../types'
import { createOperationsGenerator } from '#image'

export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    quality: 'q',
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`,
})

export const getImage: ProviderGetImage = (src, { modifiers = {} } = {}) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(src + (operations ? ('?' + operations) : '')),
  }
}
