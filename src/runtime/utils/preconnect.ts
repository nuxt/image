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
