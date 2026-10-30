import { useHead, useRequestURL } from '#imports'

/**
 * Resolve the origin a cross-origin image URL should be preconnected to.
 *
 * Returns `undefined` when the URL is empty, relative, same-origin as
 * `baseHref`, not parseable, or not an `http(s)` URL (so `data:`, `blob:`
 * and other schemes are ignored).
 */
export function resolvePreconnectOrigin(url: string | undefined, baseHref: string): string | undefined {
  if (!url) {
    return
  }

  let base: URL
  let resolved: URL
  try {
    base = new URL(baseHref)
    resolved = new URL(url, base)
  }
  catch {
    return
  }

  if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') {
    return
  }

  if (resolved.origin === base.origin) {
    return
  }

  return resolved.origin
}

/**
 * @internal
 */
export interface PreconnectOptions {
  crossorigin?: 'anonymous' | 'use-credentials' | '' | boolean
}

/**
 * Registers keyed `<link rel="preconnect">` hints for the origins of rendered
 * image URLs, in a single `useHead` call so unhead dedupes repeated origins
 * into one hint each. No-op on the client, and for empty, relative,
 * same-origin or non-http(s) URLs.
 *
 * @internal
 */
export const addPreconnect = (urls: Array<string | undefined>, options: PreconnectOptions = {}): void => {
  if (import.meta.client) {
    return
  }

  let base: string
  try {
    base = useRequestURL().href
  }
  catch {
    return
  }

  // an empty crossorigin attribute means "anonymous", same as `true`
  const crossorigin: 'anonymous' | 'use-credentials' | undefined = options.crossorigin === true || options.crossorigin === ''
    ? 'anonymous'
    : (options.crossorigin || undefined)

  const links = new Map<string, { rel: 'preconnect', href: string, key: string, crossorigin?: 'anonymous' | 'use-credentials' }>()
  for (const url of urls) {
    const origin = resolvePreconnectOrigin(url, base)
    if (!origin) {
      continue
    }

    const key = `preconnect:${origin}${crossorigin ? `:${crossorigin}` : ''}`
    if (links.has(key)) {
      continue
    }

    links.set(key, {
      rel: 'preconnect',
      href: origin,
      key,
      ...(crossorigin ? { crossorigin } : {}),
    })
  }

  if (!links.size) {
    return
  }

  useHead({ link: [...links.values()] })
}
