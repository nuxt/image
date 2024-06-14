import type { $Img } from '../module'

import { createImage } from './image'
// @ts-expect-error virtual file
import { imageOptions } from '#build/image-options'
import { useNuxtApp, useRuntimeConfig } from '#imports'

export const useImage = (): $Img => {
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()

  return nuxtApp.$img as $Img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    nuxt: {
      baseURL: config.app.baseURL,
    },
  }))
}
