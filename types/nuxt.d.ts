import { $Image } from './runtime'
import { ModuleOptions } from './module'

declare module '@nuxt/types' {
  interface Context {
    $img: $Image
  }

  interface NuxtAppOptions {
    $img: $Image
  }

  interface Configuration {
    image: ModuleOptions
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $img: $Image
  }
}
