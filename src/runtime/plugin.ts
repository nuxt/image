import { createImage } from '#image'
import { imageOptions } from '#build/image-options'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(() => {
  const img = createImage(imageOptions)
  return {
    provide: {
      img
    }
  }
})
