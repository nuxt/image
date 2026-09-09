import { hasProtocol } from 'ufo'
import { getBunImageURL } from './bun'
import type { BunOptions } from './bun'
import { defineProvider } from '../utils/provider'

/** Collapse repeated slashes in a local pathname, leaving absolute URLs, queries and fragments alone. */
function normalizeSource(src: string): string {
  if (hasProtocol(src, { acceptRelative: true })) {
    return src
  }
  return src.replace(/^[^?#]*/, pathname => pathname.replace(/\/{2,}/g, '/'))
}

export default defineProvider<Partial<BunOptions>>({
  validateDomains: true,
  supportsAlias: true,
  getImage(src, { modifiers, baseURL, unsupported }, ctx) {
    return {
      url: getBunImageURL(normalizeSource(src), modifiers, baseURL, ctx.options.nuxt.baseURL, unsupported),
    }
  },
})
