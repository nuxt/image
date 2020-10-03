import { RuntimeProvider, ImageModifiers } from 'types'
import { cleanDoubleSlashes } from '../../runtime/provider-utils'

export default <RuntimeProvider> {
  generateURL (src: string, modifiers: ImageModifiers) {
    const operations = []

    const fit = modifiers.fit ? `_${modifiers.fit}` : ''
    if (modifiers.width && modifiers.height) {
      operations.push(`s_${modifiers.width}_${modifiers.height}${fit}`)
    } else if (modifiers.width) {
      operations.push(`w_${modifiers.width}${fit}`)
    } else if (modifiers.height) {
      operations.push(`h_${modifiers.height}${fit}`)
    }

    const operationsString = operations.length ? operations.join(',') : '_'
    return {
      url: cleanDoubleSlashes(`/_image/local/${modifiers.format || '_'}/${operationsString}/${src}`),
      isStatic: true
    }
  }
}
