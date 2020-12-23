import { RuntimeProviderGetImage } from 'src'
import { hasProtocol, joinURL } from 'ufo'
import { createOperationsGenerator } from '@nuxt/image/runtime'

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

export const getImage: RuntimeProviderGetImage = (src, { modifiers, baseURL }) => {
  const format = modifiers.format || '_'
  delete modifiers.format

  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}_${modifiers.height}`
    delete modifiers.width
    delete modifiers.height
  }

  src = hasProtocol(src) ? src : joinURL('http://localhost:3000', src)

  const operationsString = operationsGenerator(modifiers) || '_'

  return {
    url: joinURL(baseURL, 'default', format, operationsString, encodeURIComponent(src)),
    isStatic: true
  }
}
