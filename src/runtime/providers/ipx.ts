import { ProviderGetImage } from 'src'
import { hasProtocol, joinURL } from 'ufo'
import { createOperationsGenerator } from '~image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: 'f',
    width: 'w',
    height: 'h',
    resize: 's',
    quality: 'q',
    background: 'b'
  },
  valueMap: {
    background (value = '') {
      if (value.startsWith('#')) {
        return value.replace('#', 'hex_')
      }
      return value
    }
  },
  joinWith: ',',
  formatter: (key, value) => `${key}_${value}`
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  const format = modifiers.format || '_'
  delete modifiers.format

  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}_${modifiers.height}`
    delete modifiers.width
    delete modifiers.height
  }

  const operationsString = operationsGenerator(modifiers) || '_'

  const type = hasProtocol(src) ? 'remote' : 'static'

  return {
    url: joinURL(baseURL, type, format, operationsString, src)
  }
}
