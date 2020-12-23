import type { $Image } from './image'

declare module '@nuxt/types' {
  interface Context {
    $img: $Image
  }

  interface NuxtAppOptions {
    $img: $Image
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $img: $Image
  }
}
