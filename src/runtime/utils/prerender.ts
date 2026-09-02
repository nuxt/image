import type { H3Event } from 'h3'
import { appendHeader } from 'h3'

/** Route prefixes of the self-hosted engines whose output is prerendered on static builds. */
const STATIC_IMAGE_PREFIXES = ['/_ipx/', '/_bun/']

export function prerenderStaticImages(src = '', srcset = '', event?: H3Event) {
  if (!import.meta.server || !import.meta.prerender || !event) {
    return
  }

  const paths = [
    src,
    ...srcset.split(', ').map(s => s.trim().split(' ')[0]!.trim()),
  ].filter(s => s && STATIC_IMAGE_PREFIXES.some(prefix => s.includes(prefix)))

  if (!paths.length) {
    return
  }

  appendHeader(event, 'x-nitro-prerender', paths.map(p => encodeURIComponent(p)).join(', '))
}
