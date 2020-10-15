import { RuntimeProvider, ImageModifiers } from 'types'
import { cleanDoubleSlashes } from '../../runtime/provider-utils'

function predictAdapter (src: string) {
  return src.match(/^https?:\/\//) ? 'remote' : 'local'
}

export default <RuntimeProvider> {
  getImage (src: string, modifiers: ImageModifiers, { baseURL }) {
    const operations = []

    const fit = modifiers.fit ? `_${modifiers.fit}` : ''
    if (modifiers.width && modifiers.height) {
      operations.push(`s_${modifiers.width}_${modifiers.height}${fit}`)
    } else if (modifiers.width) {
      operations.push(`w_${modifiers.width}${fit}`)
    } else if (modifiers.height) {
      operations.push(`h_${modifiers.height}${fit}`)
    }

    const adapter = predictAdapter(src)

    const operationsString = operations.join(',') || '_'
    const url = cleanDoubleSlashes(`/_image/local/${adapter}/${modifiers.format || '_'}/${operationsString}/${src}`)
    const infoUrl = cleanDoubleSlashes(`/_image/local/${adapter}/jpg.json/${operationsString}/${src}`)
    return {
      url,
      isStatic: true,
      getInfo: async () => {
        const { width, height, size } = await fetch(cleanDoubleSlashes(baseURL + infoUrl)).then(res => res.json())
        return { width, height, size }
      }
    }
  }
}
