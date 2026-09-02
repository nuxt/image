import { getBunImageURL } from './bun'
import type { BunOptions } from './bun'
import { defineProvider } from '../utils/provider'

export default defineProvider<Partial<BunOptions>>({
  validateDomains: true,
  supportsAlias: true,
  getImage(src, { modifiers, baseURL, unsupported }, ctx) {
    return {
      url: getBunImageURL(src, modifiers, baseURL, ctx.options.nuxt.baseURL, unsupported).replace(/\/{2,}/g, '/'),
    }
  },
})
