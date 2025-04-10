import type { Plugin } from 'nuxt/app'
import type { $Img } from '@nuxt/image'
import { defineNuxtPlugin, useImage } from '#imports'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      img: useImage(),
    },
  }
}) as Plugin<{ img: $Img }>
