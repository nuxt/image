import type { H3Event } from 'h3'
import { appendHeader } from 'h3'
import { hasProtocol, joinURL, parseURL, withTrailingSlash } from 'ufo'
import type { CreateImageOptions } from '@nuxt/image'

const DEFAULT_BASE_URLS: Record<string, string> = {
  ipx: '/_ipx',
  ipxStatic: '/_ipx',
  bun: '/_bun',
  bunStatic: '/_bun',
}

const prefixCache = new WeakMap<CreateImageOptions, string[]>()

/**
 * Route prefixes of the configured self-hosted engines, whose output is
 * prerendered on static builds. Honours a relative custom `baseURL`; an
 * external one is served elsewhere and skipped.
 */
export function getStaticImagePrefixes(options: CreateImageOptions): string[] {
  let prefixes = prefixCache.get(options)
  if (!prefixes) {
    const found = new Set<string>()
    const providers = options.providers as Record<string, { defaults?: { baseURL?: string } } | undefined>
    for (const name in DEFAULT_BASE_URLS) {
      const provider = providers?.[name]
      if (!provider) {
        continue
      }
      const baseURL = provider.defaults?.baseURL
      if (baseURL && hasProtocol(baseURL, { acceptRelative: true })) {
        continue
      }
      found.add(withTrailingSlash(baseURL || joinURL(options.nuxt.baseURL, DEFAULT_BASE_URLS[name]!)))
    }
    prefixes = [...found]
    prefixCache.set(options, prefixes)
  }
  return prefixes
}

/** Local image URLs from `src` and `srcset` whose pathname starts with one of the self-hosted route prefixes. */
export function matchStaticImagePaths(src = '', srcset = '', prefixes: string[] = ['/_ipx/', '/_bun/']): string[] {
  const candidates = [src, ...srcset.split(', ').map(s => s.trim().split(' ')[0]!.trim())]
  return candidates.filter((candidate) => {
    if (!candidate || hasProtocol(candidate, { acceptRelative: true })) {
      return false
    }
    const { pathname } = parseURL(candidate)
    return prefixes.some(prefix => pathname.startsWith(prefix))
  })
}

export function prerenderStaticImages(src = '', srcset = '', event?: H3Event, prefixes?: string[]) {
  if (!import.meta.server || !import.meta.prerender || !event) {
    return
  }

  const paths = matchStaticImagePaths(src, srcset, prefixes)
  if (!paths.length) {
    return
  }

  appendHeader(event, 'x-nitro-prerender', paths.map(p => encodeURIComponent(p)).join(', '))
}
