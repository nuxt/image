import type { H3Event } from 'h3'
import { appendHeader } from 'h3'
import { hasProtocol, joinURL, withTrailingSlash } from 'ufo'
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

export function prerenderStaticImages(src = '', srcset = '', event?: H3Event, prefixes: string[] = ['/_ipx/', '/_bun/']) {
  if (!import.meta.server || !import.meta.prerender || !event) {
    return
  }

  const paths = [
    src,
    ...srcset.split(', ').map(s => s.trim().split(' ')[0]!.trim()),
  ].filter(s => s && prefixes.some(prefix => s.includes(prefix)))

  if (!paths.length) {
    return
  }

  appendHeader(event, 'x-nitro-prerender', paths.map(p => encodeURIComponent(p)).join(', '))
}
