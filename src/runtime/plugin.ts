import type { Plugin } from 'nuxt/app'
import type { $Img } from '../types'
import { createImage } from '#image'
// @ts-ignore
import { imageOptions } from '#build/image-options'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const img = createImage({
    ...imageOptions,
    nuxt: {
      baseURL: config.app.baseURL
    }
  })
  return {
    provide: {
      img
    }
  }
}) as Plugin<{ img: $Img }>
