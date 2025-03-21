import type { H3Event } from 'h3'

import type { Img } from '../../../module'
import { createImage } from '../../image'

// @ts-expect-error virtual file
import { imageOptions } from '#image-options'
import { useRuntimeConfig } from '#imports'

export const useImage = (event?: H3Event): Img => {
  const config = useRuntimeConfig()

  return createImage({
    ...imageOptions,
    nuxt: {
      baseURL: config.app.baseURL,
    },
    event,
    runtimeConfig: config,
  })
}
