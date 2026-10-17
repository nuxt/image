import type { H3Event } from 'h3'
import { createImage } from './image'
import { resolvePreconnectOrigin } from './utils/preconnect'
import type { $Img } from '@nuxt/image'

import { imageOptions } from '#build/image-options.mjs'
import { createError, useHead, useNuxtApp, useRequestURL, useRuntimeConfig } from '#imports'

export const useImage = (event?: H3Event): $Img => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()

  return nuxtApp.$img as $Img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    event: event || nuxtApp.ssrContext?.event,
    nuxt: {
      baseURL: config.app.baseURL,
      createError,
    },
    runtimeConfig: config,
  }))
}

interface PreconnectOptions {
  crossorigin?: 'anonymous' | 'use-credentials' | boolean
}

/**
 * Registers a deduped `<link rel="preconnect">` for the origin of a rendered
 * image URL. No-op on the client, and for empty, relative, same-origin or
 * non-http(s) URLs.
 */
export const usePreconnect = (url: string | undefined, options: PreconnectOptions = {}): void => {
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

  const crossorigin = options.crossorigin === true ? 'anonymous' : (options.crossorigin || undefined)

  useHead({
    link: [{
      rel: 'preconnect',
      href: origin,
      key: `preconnect:${origin}${crossorigin ? `:${crossorigin}` : ''}`,
      ...(crossorigin ? { crossorigin } : {}),
    }],
  })
}
