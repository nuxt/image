import { ProviderGetImage } from 'src'
import { joinURL, encodeQueryItem, encodePath } from 'ufo'
import { createOperationsGenerator } from '~image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'f',
    fit: 'fit',
    width: 'w',
    height: 'h',
    resize: 's',
    quality: 'q',
    background: 'b'
  },
  joinWith: '&',
  formatter: (key, val) => encodeQueryItem(key, val)
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/_ipx' } = {}, { nuxtContext: { base: nuxtBase = '/' } = {} }) => {
  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}_${modifiers.height}`
    delete modifiers.width
    delete modifiers.height
  }

  const params = operationsGenerator(modifiers)

  return {
    url: joinURL(nuxtBase, baseURL, encodePath(src) + (params ? '?' + params : ''))
  }
}

export const supportsAlias = true
