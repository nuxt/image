import { RuntimeProvider, ImageModifiers } from 'types'
import { createMapper, createOperationsGenerator } from '~image/utils'

const fits = createMapper({
  fill: 'resize',
  inside: 'contain-max',
  outside: 'contain-min',
  cover: 'cover',
  contain: 'contain',
  missingValue: 'cover'
})

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'format',
    quality: 'quality',
    background: 'background'
  },
  valueMap: {
    format (value) {
      if (value === 'jpg') {
        return 'jpeg'
      }
      return value
    }
  },
  joinWith: '/',
  formatter: (key, value) => `${key}=${value}`
})

export default <RuntimeProvider> {
  getImage (src: string, modifiers: ImageModifiers, options: any) {
    const { width, height, fit, format, ...providerModifiers } = modifiers

    if (width || height) {
      providerModifiers[fits(fit)] = `${width || '-'}x${height || '-'}`
    }
    const operations = operationsGenerator(providerModifiers)
    const twicpicsOperations = (operations) ? '?twic=v1/' + operations : ''

    return {
      url: options.baseURL + src + twicpicsOperations
    }
  }
}
