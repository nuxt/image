import type { H3Event } from 'h3'
import type { $Img } from '../module'

import { createImage } from './image'
import { imageOptions } from '#build/image-options.mjs'
import { useNuxtApp, useRuntimeConfig } from '#imports'

export const useImage = (_event?: H3Event): $Img => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()

  return nuxtApp.$img as $Img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    event: nuxtApp.ssrContext?.event,
    nuxt: {
      baseURL: config.app.baseURL,
    },
    runtimeConfig: config,
  }))
}
