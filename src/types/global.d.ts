import type { $Image } from './image'
import { ModuleOptions } from './module'

declare module '@nuxt/types' {
  interface Context {
    $img: $Image
  }

  interface NuxtAppOptions {
    $img: $Image
  }

  interface Configuration {
    image?: Partial<ModuleOptions>
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $img: $Image
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  interface Store<S> {
    $img: $Image
  }
}
