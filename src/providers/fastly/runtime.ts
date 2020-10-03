import { RuntimeProvider, ImageModifiers } from 'types'
import { createOperationsGenerator } from '../../runtime/provider-utils'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    size: 'fit'
  },
  valueMap: {
    size: {
      fill: 'crop',
      inside: 'crop',
      outside: 'crop',
      cover: 'bounds',
      contain: 'bounds'
    }
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`
})

export default <RuntimeProvider> {
  generateURL (src: string, modifiers: ImageModifiers, options: any) {
    const operations = operationsGenerator(modifiers)
    return {
      url: options.baseURL + src + '?' + operations
    }
  }
}
