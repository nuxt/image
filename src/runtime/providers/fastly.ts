import { parseQuery, withBase, withQuery } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

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
})

interface FastlyOptions {
  baseURL?: string
}

export default defineProvider<FastlyOptions>({
  getImage: (src, { modifiers, baseURL = '/' }) => {
    const operations = operationsGenerator(modifiers)
    return {
      url: withBase(
        withQuery(src, parseQuery(operations)),
        baseURL,
      ),
    }
  },
})
