import { RuntimeProvider, ImageModifiers } from 'types'
import { createOperationsGenerator } from '../../runtime/provider-utils'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    size: 'c',
    width: 'w',
    height: 'h',
    format: 'f'
  },
  valueMap: {
    size: {
      fill: 'fill',
      inside: 'pad',
      outside: 'lpad',
      cover: 'fit',
      contain: 'scale'
    }
  },
  joinWith: ',',
  formatter: (key, value) => `${key}_${value}`
})

export default <RuntimeProvider> {
  generateURL (src: string, modifiers: ImageModifiers, options: any) {
    const operations = operationsGenerator(modifiers)

    return {
      url: options.baseURL + '/' + operations + src
    }
  }
}
