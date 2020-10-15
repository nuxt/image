import { RuntimeProvider, ImageModifiers } from 'types'
import { cleanDoubleSlashes, createOperationsGenerator } from '../../runtime/provider-utils'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: 'c',
    width: 'w',
    height: 'h',
    format: 'f'
  },
  valueMap: {
    fit: {
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
  getImage (src: string, modifiers: ImageModifiers, options: any) {
    const operations = operationsGenerator(modifiers)

    return {
      url: cleanDoubleSlashes(options.baseURL + '/' + operations + src)
    }
  }
}
