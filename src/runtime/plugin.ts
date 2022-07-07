import { createImage } from '#image'
import { imageOptions } from '#build/image-options'

export default defineNuxtPlugin(() => {
  const img = createImage(imageOptions)
  return {
    provide: {
      img
    }
  }
})
