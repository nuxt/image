import { RuntimeProvider, ImageModifiers } from 'types'
import { createMapper, createOperationsGenerator } from '../../runtime/provider-utils'

const sizes = createMapper({
  fill: 'fill',
  inside: 'pad',
  outside: 'lpad',
  cover: 'fit',
  contain: 'scale',
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
    const { width, height, size, ...providerModifiers } = modifiers

    const operations = operationsGenerator({
      ...providerModifiers,
      [sizes(size)]: `${width || '-'}x${height || '-'}`
    })

    return {
      url: options.baseURL + src + '?twic=v1/' + operations
    }
  }
}
