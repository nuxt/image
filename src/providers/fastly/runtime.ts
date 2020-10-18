import { RuntimeProvider, ImageModifiers } from 'types'
import { cleanDoubleSlashes, createOperationsGenerator } from '~image/utils'
import fetch from "~image/fetch"

const operationsGenerator = createOperationsGenerator({
  valueMap: {
    fit: {
      fill: 'crop',
      inside: 'crop',
      outside: 'crop',
      cover: 'bounds',
      contain: 'bounds'
    }
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`
})

export default <RuntimeProvider> {
  getImage (src: string, modifiers: ImageModifiers, options: any) {
    const operations = operationsGenerator(modifiers)
    const url = cleanDoubleSlashes(options.baseURL + src + '?' + operations)
    return {
      url,
      getInfo: async () => {
        const infoString = await fetch(url).then(res => res.headers.get('fastly-io-info') || '')
        const info = Object.fromEntries(infoString.split(' ').map(part => part.split('=')))
        const [width, height] = (info.idim || '').split('x').map(p => parseInt(p, 10))
        return {
          width,
          height,
          bytes: info.ifsz
        }
      }
    }
  }
}
