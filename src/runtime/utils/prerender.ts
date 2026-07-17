import type { H3Event } from 'h3'

export function prerenderStaticImages(src = '', srcset = '', event?: H3Event) {
  if (!import.meta.server || !import.meta.prerender || !event) {
    return
  }

  const paths = [
    src,
    ...srcset.split(', ').map(s => s.trim().split(' ')[0]!.trim()),
  ].filter(s => s && s.includes('/_ipx/'))

  if (!paths.length) {
    return
  }

  event.res.headers.append('x-nitro-prerender', paths.map(p => encodeURIComponent(p)).join(', '))
}
