import { joinURL, encodePath } from 'ufo'
import type { ProviderGetImage } from '../../module'
import { operationsGenerator } from './ipx'

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
    url: joinURL(baseURL, params, encodePath(src).replace(/\/{2,}/g, '/')),
  }
}

export { validateDomains, supportsAlias } from './ipx'
