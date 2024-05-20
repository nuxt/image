import { appendHeader } from 'h3'
import { useRequestEvent } from '#imports'

export function prerenderStaticImages(src = '', srcset = '') {
  if (!import.meta.server || !process.env.prerender) {
    return
  }

  const paths = [
    src,
    ...srcset.split(', ').map(s => s.trim().split(' ')[0].trim()),
  ].filter(s => s && s.includes('/_ipx/'))

  if (!paths.length) {
    return
  }

  appendHeader(
    useRequestEvent()!,
    'x-nitro-prerender',
    paths.map(p => encodeURIComponent(p)).join(', '),
  )
}
