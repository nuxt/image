import { RuntimeProvider, ImageModifiers } from 'types'
import { createOperationsGenerator } from '~image/utils'

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
  getImage (src: string, modifiers: ImageModifiers, options: any) {
    const operations = operationsGenerator(modifiers)
    return {
      url: options.baseURL + src + '?' + operations
    }
  }
}
