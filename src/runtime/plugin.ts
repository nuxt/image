import type { Plugin } from 'nuxt/app'
import type { $Img } from '../types'
import { defineNuxtPlugin, useImage } from '#imports'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      img: useImage(),
    },
  }
}) as Plugin<{ img: $Img }>
