import type { CreateImageOptions } from '@nuxt/image'

export function prerenderStaticImages(src = '', srcset = '', event?: CreateImageOptions['event']) {
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

  const value = paths.map(p => encodeURIComponent(p)).join(', ')
  if ('res' in event && 'headers' in event.res) {
    event.res.headers.append('x-nitro-prerender', value)
  }
  else if ('node' in event) {
    // h3 v1 (Nitro v2) event
    event.node.res.appendHeader('x-nitro-prerender', value)
  }
}
