import type { H3Event } from 'h3'
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
  if ('headers' in event.res) {
    event.res.headers.append('x-nitro-prerender', value)
  }
  else {
    (event as H3Event).node.res.appendHeader('x-nitro-prerender', value)
  }
}
