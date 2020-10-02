import { RuntimeProvider, ImageModifiers } from 'types'

function getSizeOperator (size) {
  if (!size) {
    return 'bounds'
  }
  switch (size) {
    case 'contain':
      return 'bounds'
    case 'fill':
    case 'inside':
    case 'outside':
      return 'crop'
    default:
      return size
  }
}

export default <RuntimeProvider> {
  generateURL (src: string, modifiers: ImageModifiers, options: any) {
    const { width, height, format, size, ...providerModifiers } = modifiers
    const operations = []

    if (width) {
      operations.push('width=' + encodeURIComponent(width))
    }
    if (height) {
      operations.push('height=' + encodeURIComponent(height))
    }
    if (format) {
      operations.push('format=' + encodeURIComponent(format))
    }
    operations.push('fit=' + encodeURIComponent(getSizeOperator(size)))

    Object.entries(providerModifiers).forEach(([key, value]) => {
      operations.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    })

    const operationsString = operations.join('&')
    return {
      url: (options.baseURL + src + '?' + operationsString).replace(/(https?:\/\/)|(\/)+/g, '$1$2')
    }
  }
}
