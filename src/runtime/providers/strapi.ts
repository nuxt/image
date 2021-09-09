import { ProviderGetImage } from 'src'
import { withBase, joinURL } from 'ufo'

// https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#upload

export const getImage: ProviderGetImage = (src, { modifiers, baseURL = 'http://localhost:1337/uploads' } = {}) => {
  const breakpoint = modifiers?.breakpoint ?? ''

  if (!breakpoint) {
    return {
      url: withBase(joinURL(src), baseURL)
    }
  }

  if (src.startsWith('/')) {
    src = src.slice(1)
  }

  return {
    url: withBase(joinURL(`${breakpoint}_${src}`), baseURL)
  }
}

export const validateDomains = true
