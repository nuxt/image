import { joinURL, encodeParam, normalizeURL } from 'ufo'
import type { ProviderGetImage } from '../../types'
import { createOperationsGenerator } from '#image'

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
  formatter: (key, val) => encodeParam(key) + '_' + encodeParam(val)
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL } = {}, ctx) => {
  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}x${modifiers.height}`
    delete modifiers.width
    delete modifiers.height
  }

  const params = operationsGenerator(modifiers) || '_'

  if (!baseURL) {
    baseURL = joinURL(ctx.options.nuxt.baseURL, '/_ipx')
  }

  return {
    url: joinURL(baseURL, params, normalizeURL(src))
  }
}

export const validateDomains = true
export const supportsAlias = true
