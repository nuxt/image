import { joinURL } from 'ufo'
import type { ProviderGetImage } from 'src'
import { createOperationsGenerator } from '~image'

const endpoint = 'https://opt.moovweb.net'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    height: 'height',
    quality: 'quality',
    width: 'width'
  },
  joinWith: '&',
  formatter: (key, value) => String(value) === 'true' ? key : `${key}=${value}`
})

export const getImage: ProviderGetImage = (src, { modifiers = {} } = {}) => {
  const operations = operationsGenerator(modifiers)

  return {
    url: joinURL(endpoint, '?img=' + src + (operations ? ('&' + operations) : ''))
  }
}
