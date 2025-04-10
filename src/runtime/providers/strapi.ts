import { withBase, withoutLeadingSlash } from 'ufo'
import { defineProvider } from '../utils/provider'

// https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#upload

interface StrapiOptions {
  baseURL?: string
  modifiers?: {
    breakpoint?: string
  }
}

export default defineProvider<StrapiOptions>({
  validateDomains: true,
  getImage: (src, { modifiers, baseURL = 'http://localhost:1337/uploads' }) => {
    const breakpoint = modifiers?.breakpoint ?? ''

    if (!breakpoint) {
      return {
        url: withBase(src, baseURL),
      }
    }

    return {
      url: withBase(`${breakpoint}_${withoutLeadingSlash(src)}`, baseURL),
    }
  },
})
