import { RuntimeProvider, ImageModifiers } from 'types'
import { createMapper, createOperationsGenerator, cleanDoubleSlashes } from '../../runtime/provider-utils'

const fits = createMapper({
  fill: 'fill',
  inside: 'pad',
  outside: 'lpad',
  cover: 'cover',
  contain: 'contain',
  missingValue: 'cover'
})

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'format'
  },
  joinWith: '/',
  formatter: (key, value) => `${key}=${value}`
})

export default <RuntimeProvider> {
  generateURL (src: string, modifiers: ImageModifiers, options: any) {
    const { width, height, fit, ...providerModifiers } = modifiers

    if (width || height) {
      providerModifiers[fits(fit)] = `${width || '-'}x${height || '-'}`
    }
    const operations = operationsGenerator(providerModifiers)

    return {
      url: cleanDoubleSlashes(options.baseURL + src + '?twic=v1/' + operations)
    }
  }
}
