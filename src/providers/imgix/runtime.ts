import { RuntimeProvider, ImageModifiers } from 'types'
import { cleanDoubleSlashes, createOperationsGenerator } from '~image/utils'
import fetch from '~image/fetch'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    format: 'fm'
  },
  valueMap: {
    fit: {
      fill: 'scale',
      inside: 'fit-max',
      outside: 'fit-min',
      cover: 'crop',
      contain: 'fill'
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
        const info = await fetch(url + '&fm=json').then(res => res.json())
        return {
          width: info.PixelWidth,
          height: info.PixelHeight,
          bytes: info['Content-Length']
        }
      }
    }
  }
}
