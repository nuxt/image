import type { $Img } from '../module'

import { createImage } from './image'
import { imageOptions } from '#build/image-options.mjs'
import { useNuxtApp, useRuntimeConfig } from '#imports'

export const useImage = (): $Img => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()

  return nuxtApp.$img as $Img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    nuxt: {
      baseURL: config.app.baseURL,
    },
    runtimeConfig: config,
  }))
}
