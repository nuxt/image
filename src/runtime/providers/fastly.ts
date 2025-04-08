import { joinURL } from 'ufo'
import { defineProvider, createOperationsGenerator } from '#image'

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

interface FastlyOptions {
  baseURL?: string
}

export default defineProvider<FastlyOptions>({
  getImage: (src, { modifiers, baseURL = '/' }) => {
    const operations = operationsGenerator(modifiers)
    return {
      url: joinURL(baseURL, src + (operations ? ('?' + operations) : '')),
    }
  },
})
