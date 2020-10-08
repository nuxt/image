import { RuntimeProvider, ImageModifiers } from 'types'
import { cleanDoubleSlashes, createOperationsGenerator } from '../../runtime/provider-utils'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    format: 'fm'
  },
  valueMap: {
    fit: {
      fill: 'crop',
      inside: 'crop',
      outside: 'crop',
      cover: 'clip',
      contain: 'clip'
    }
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`
})

export default <RuntimeProvider> {
  generateURL (src: string, modifiers: ImageModifiers, options: any) {
    const operations = operationsGenerator(modifiers)
    return {
      url: cleanDoubleSlashes(options.baseURL + src + '?' + operations)
    }
  }
}
