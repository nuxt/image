import { joinURL } from 'ufo'
import type { ProviderGetImage } from '../../module'
import { createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    height: 'height',
    quality: 'quality',
    width: 'width',
  },
  joinWith: '&',
  formatter: (key, value) => String(value) === 'true' ? key : `${key}=${value}`,
})

export const getImage: ProviderGetImage = (src, {
  modifiers = {},
  baseURL = 'https://opt.moovweb.net',
} = {}) => {
  const operations = operationsGenerator(modifiers)

  return {
    url: joinURL(baseURL, '?img=' + src + (operations ? ('&' + operations) : '')),
  }
}
