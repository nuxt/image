import { joinURL, encodePath, encodeParam } from 'ufo'
import { ProviderGetImage } from 'src'
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
  joinWith: ',',
  formatter: (key, val) => encodeParam(key) + '_' + encodeParam(val)
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/_ipx' } = {}, { nuxtContext: { base: nuxtBase = '/' } = {} }) => {
  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}x${modifiers.height}`
    delete modifiers.width
    delete modifiers.height
  }

  const params = operationsGenerator(modifiers) || '_'

  return {
    url: joinURL(nuxtBase, baseURL, params, encodePath(src))
  }
}

export const validateDomains = true
export const supportsAlias = true
