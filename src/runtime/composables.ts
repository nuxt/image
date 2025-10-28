import type { H3Event } from 'h3'
import { createImage } from './image'
import type { $Img, Img, ConfiguredImageProviders } from '@nuxt/image'

import { imageOptions } from '#build/image-options.mjs'
import { useNuxtApp, useRuntimeConfig } from '#imports'

export const useImage = <Provider extends keyof ConfiguredImageProviders = keyof ConfiguredImageProviders>(event?: H3Event): $Img<Provider> => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()

  return nuxtApp.$img as $Img<Provider> || nuxtApp._img as Img<Provider> || (nuxtApp._img = createImage({
    ...imageOptions,
    event: event || nuxtApp.ssrContext?.event,
    nuxt: {
      baseURL: config.app.baseURL,
    },
    runtimeConfig: config,
  })) as Img<Provider> as $Img<Provider>
}
