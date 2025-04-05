import { joinURL } from 'ufo'
import { defineProvider } from '../provider'
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

interface EdgioOptions {
  baseURL?: string
}

export default defineProvider<EdgioOptions>({
  getImage: (src, {
    modifiers,
    baseURL = 'https://opt.moovweb.net',
  }) => {
    const operations = operationsGenerator(modifiers)

    return {
      url: joinURL(baseURL, '?img=' + src + (operations ? ('&' + operations) : '')),
    }
  },
})
