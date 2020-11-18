import { RuntimeProvider, ImageModifiers } from 'types'
import { isRemoteUrl } from '~image/utils'

export default <RuntimeProvider> {
  getImage (src: string, modifiers: ImageModifiers, options: any) {
    const operations = []

    const fit = modifiers.fit ? `_${modifiers.fit}` : ''
    if (modifiers.width && modifiers.height) {
      operations.push(`s_${modifiers.width}_${modifiers.height}${fit}`)
    } else if (modifiers.width) {
      operations.push(`w_${modifiers.width}${fit}`)
    } else if (modifiers.height) {
      operations.push(`h_${modifiers.height}${fit}`)
    }
    if (modifiers.quality) {
      operations.push(`q_${modifiers.quality}`)
    }

    src = isRemoteUrl(src) ? src : (options.baseURL || '') + src

    const operationsString = operations.join(',') || '_'

    return {
      url: `/_image/local/remote/${modifiers.format || '_'}/${operationsString}/${src}`,
      static: true
    }
  }
}
