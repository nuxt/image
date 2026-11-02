import { useHead, useRequestURL } from '#imports'

/** Resolves the origin to preconnect to, or `undefined` for empty, relative, same-origin, unparseable or non-http(s) URLs. */
function resolvePreconnectOrigin(url: string | undefined, baseHref: string): string | undefined {
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

  // keep protocol-relative urls scheme-less: prerendering runs over http, but the browser must pick the page's protocol
  if (url.startsWith('//')) {
    return resolved.host === base.host ? undefined : `//${resolved.host}`
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
 * Registers `<link rel="preconnect">` hints for image origins in one `useHead` call.
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
