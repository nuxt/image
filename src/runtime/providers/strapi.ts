import { withBase, withoutLeadingSlash } from 'ufo'
import { ProviderGetImage } from 'src'

// https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#upload

export const getImage: ProviderGetImage = (src, { modifiers, baseURL = 'http://localhost:1337/uploads' } = {}) => {
  const breakpoint = modifiers?.breakpoint ?? ''

  if (!breakpoint) {
    return {
      url: withBase(src, baseURL)
    }
  }

  return {
    url: withBase(`${breakpoint}_${withoutLeadingSlash(src)}`, baseURL)
  }
}

export const validateDomains = true
