import { createError } from 'h3'
import type { H3Event } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

import { createImage } from '../../image'
import type { Img } from '@nuxt/image'

// @ts-expect-error virtual file
import { imageOptions } from '#internal/nuxt-image'

export const useImage = (event?: H3Event): Img => {
  const config = useRuntimeConfig()

  return createImage({
    ...imageOptions,
    nuxt: {
      baseURL: config.app.baseURL,
      createError,
    },
    event,
    runtimeConfig: config,
  })
}
