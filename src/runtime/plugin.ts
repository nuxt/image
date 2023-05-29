import { defineNuxtPlugin, useImage } from '#imports'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      img: useImage()
    }
  }
})
