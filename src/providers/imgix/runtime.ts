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

export default <RuntimeProvider> {
  generateURL (src: string, modifiers: ImageModifiers, options: any) {
    const operations = operationsGenerator(modifiers)
    return {
      url: cleanDoubleSlashes(options.baseURL + src + '?' + operations)
    }
  }
}
