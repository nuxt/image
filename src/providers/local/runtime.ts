import { RuntimeProvider, ImageModifiers } from '../../types'

export default <RuntimeProvider> {
  generateURL(src: string, modifiers: ImageModifiers, options: any) {
    const operations = []

    const size = modifiers.size ? `_${modifiers.size}` : ''
    if (modifiers.width && modifiers.height) {
      operations.push(`s_${modifiers.width}_${modifiers.height}${size}`)
    } else if (modifiers.width) {
      operations.push(`w_${modifiers.width}${size}`)
    } else if (modifiers.height) {
      operations.push(`h_${modifiers.height}${size}`)
    }

    const operationsString = operations.length ? operations.join(',') : '_'
    return {
      url: `/_image/local/${modifiers.format || '_'}/${operationsString}/${src.replace(/^\//, '')}`,
      isStatic: true
    };
  }
}
