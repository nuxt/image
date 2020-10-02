import { RuntimeProvider, ImageModifiers } from 'types'

function getSizeOperator (size) {
  if (!size) {
    return 'cover'
  }
  switch (size) {
    case 'fill':
      return 'resize'
    case 'inside':
      return 'min'
    case 'outside':
      return 'max'
    case 'cover':
    case 'contain':
    default:
      return size
  }
}

export default <RuntimeProvider> {
  generateURL (src: string, modifiers: ImageModifiers, options: any) {
    const { width, height, format, size, ...providerModifiers } = modifiers
    const operations = []

    if (width || height) {
      operations.push(`${getSizeOperator(size)}=${width || '-'}x${height || '-'}`)
    }
    if (format) {
      operations.push(`format=${format}`)
    }

    Object.entries(providerModifiers).forEach(([key, value]) => {
      operations.push(`${key}=${String(value)}`)
    })

    const operationsString = operations.join('/')
    return {
      url: (options.baseURL + src + '?twic=v1/' + operationsString).replace(/(https?:\/\/)|(\/)+/g, '$1$2')
    }
  }
}
