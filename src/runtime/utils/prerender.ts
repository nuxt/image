import type { RuntimeConfig } from '@nuxt/schema'
import type { H3Event } from 'h3'
import { appendHeader } from 'h3'

export function prerenderStaticImages(src = '', srcset = '', event?: H3Event, runtimeConfig?: RuntimeConfig) {
  if (!import.meta.server || !import.meta.prerender || !event) {
    return
  }

  const ipx = runtimeConfig?.ipx as { baseURL?: string } | undefined
  const baseURL = (ipx?.baseURL || '/_ipx').replace(/\/+$/, '')
  const paths = [
    src,
    ...srcset.split(', ').map(s => s.trim().split(' ')[0]!.trim()),
  ].filter(s => s && s.includes(`${baseURL}/`))

  if (!paths.length) {
    return
  }

  appendHeader(event, 'x-nitro-prerender', paths.map(p => encodeURIComponent(p)).join(', '))
}
