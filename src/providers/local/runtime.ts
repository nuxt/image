import { RuntimeProvider, ImageModifiers } from 'types'
import { cleanDoubleSlashes } from '~image/utils'
import fetch from '~image/fetch'

function predictAdapter (src: string) {
  return src.match(/^https?:\/\//) ? 'remote' : 'local'
}

const middlewarePrefix = '/_image/local/'

export default <RuntimeProvider> {
  getImage (src: string, modifiers: ImageModifiers, options: any) {
    const { placeholder } = options
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
    const url = cleanDoubleSlashes(`${middlewarePrefix}${adapter}/${modifiers.format || '_'}/${operationsString}/${src}`)
    const infoUrl = cleanDoubleSlashes(`${middlewarePrefix}${adapter}/meta/${operationsString},meta_${placeholder.type}_${placeholder.encode}/${src}`)

    const baseURL = process.client ? options.baseURL : options.internalBaseURL

    let _meta
    const getMeta = () => _meta || fetch(baseURL + infoUrl)
      .then(res => res.json())

    return {
      url,
      isStatic: true,
      async getInfo () {
        const meta = await getMeta()
        return meta
      },
      async getPlaceholder () {
        const { data } = await getMeta()
        return data || url
      }
    }
  }
}
