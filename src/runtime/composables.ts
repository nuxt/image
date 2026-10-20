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

export interface PreconnectOptions {
  crossorigin?: 'anonymous' | 'use-credentials' | '' | boolean
}

/**
 * Registers a keyed `<link rel="preconnect">` for the origin of a rendered
 * image URL, so unhead dedupes repeated origins into a single hint. No-op on
 * the client, and for empty, relative, same-origin or non-http(s) URLs.
 *
 * This is an internal helper for the image components, not a supported public
 * API.
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
