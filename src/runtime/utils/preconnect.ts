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
 * Registers a keyed `<link rel="preconnect">` for the origin of a rendered
 * image URL, so unhead dedupes repeated origins into a single hint. No-op on
 * the client, and for empty, relative, same-origin or non-http(s) URLs.
 *
 * @internal
 */
export const addPreconnect = (url: string | undefined, options: PreconnectOptions = {}): void => {
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

  const origin = resolvePreconnectOrigin(url, base)
  if (!origin) {
    return
  }

  // an empty crossorigin attribute means "anonymous", same as `true`
  const crossorigin = options.crossorigin === true || options.crossorigin === ''
    ? 'anonymous'
    : (options.crossorigin || undefined)

  useHead({
    link: [{
      rel: 'preconnect',
      href: origin,
      key: `preconnect:${origin}${crossorigin ? `:${crossorigin}` : ''}`,
      ...(crossorigin ? { crossorigin } : {}),
    }],
  })
}
