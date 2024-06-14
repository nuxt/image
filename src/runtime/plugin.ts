import type { Plugin } from 'nuxt/app'
import type { $Img } from '../module'
import { defineNuxtPlugin, useImage } from '#imports'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      img: useImage(),
    },
  }
}) as Plugin<{ img: $Img }>
