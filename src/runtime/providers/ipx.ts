import { joinURL, encodePath, encodeParam } from 'ufo'
import type { ProviderGetImage } from '../../module'
import { createOperationsGenerator } from '#image'

export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: 'f',
    fit: 'fit',
    width: 'w',
    height: 'h',
    resize: 's',
    quality: 'q',
    background: 'b',
  },
  joinWith: '&',
  formatter: (key, val) => encodeParam(key) + '_' + encodeParam(val),
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL } = {}, ctx) => {
  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}x${modifiers.height}`
    delete modifiers.width
    delete modifiers.height
  }

  let params = operationsGenerator(modifiers) || '_'

  params = encodeURIComponent(params)

  if (!baseURL) {
    baseURL = joinURL(ctx.options.nuxt.baseURL, '/_ipx')
  }

  return {
    url: joinURL(baseURL, params, encodePath(src)),
  }
}

export const validateDomains = true
export const supportsAlias = true
