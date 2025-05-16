import type { H3Event } from 'h3'

import type { Img, ConfiguredImageProviders } from '@nuxt/image'
import { createImage } from '../../image'

// @ts-expect-error virtual file
import { imageOptions } from '#internal/nuxt-image'
import { useRuntimeConfig } from '#imports'

export const useImage = <Provider extends keyof ConfiguredImageProviders = keyof ConfiguredImageProviders>(event?: H3Event): Img<Provider> => {
  const config = useRuntimeConfig()

  return createImage({
    ...imageOptions,
    nuxt: {
      baseURL: config.app.baseURL,
    },
    event,
    runtimeConfig: config,
  }) as Img<Provider>
}
