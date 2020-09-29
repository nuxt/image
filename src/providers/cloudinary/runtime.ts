import { RuntimeProvider, ImageModifiers } from '../../types'

function getSizeOperator (size) {
  if (!size) {
    return 'fit'
  }
  switch (size) {
    case 'fill':
      return 'fill'
    case 'inside':
      return 'pad'
    case 'outside':
      return 'lpad'
    case 'cover':
      return 'fit'
    case 'contain':
      return 'scale'
    default:
      return size
  }
}

export default <RuntimeProvider> {
  generateURL (src: string, modifiers: ImageModifiers, options: any) {
    const { width, height, format, size, ...providerModifiers } = modifiers
    const operations = []

    if (width) {
      operations.push('w_' + width)
    }
    if (height) {
      operations.push('h_' + height)
    }
    if (format) {
      operations.push('f_' + format)
    }
    operations.push('c_' + getSizeOperator(size))

    Object.entries(providerModifiers).forEach(([key, value]) => {
      operations.push(`${key}_${String(value)}`)
    })

    const operationsString = operations.join(',')
    return {
      url: (options.baseURL + '/' + operationsString + src).replace(/(https?:\/\/)|(\/)+/g, '$1$2')
    }
  }
}
