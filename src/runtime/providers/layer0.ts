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

const isDev = process.env.NODE_ENV === 'development'

export const getImage: ProviderGetImage = (src, { modifiers = {} } = {}) => {
  const operations = operationsGenerator(modifiers)

  if (isDev) {
    return { url: src }
  }

  return {
    url: joinURL(endpoint, '?img=' + src + (operations ? ('&' + operations) : ''))
  }
}
