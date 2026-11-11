import type { NuxtRequestEvent } from '@nuxt/schema'
import { createImage } from './image'
import type { $Img } from '@nuxt/image'

import { imageOptions } from '#build/image-options.mjs'
import { createError, useNuxtApp, useRuntimeConfig } from '#imports'

export const useImage = (event?: NuxtRequestEvent): $Img => {
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
