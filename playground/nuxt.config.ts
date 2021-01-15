import type { NuxtConfig } from '@nuxt/types'
import type { } from '../src/types'

export default <NuxtConfig> {
  components: true,
  target: 'static',
  modules: [
    '../src/module.ts'
  ],
  buildModules: [
    '@nuxt/typescript-build'
  ],
  image: {
    accept: [
      'nuxtjs.org',
      'unsplash.com'
    ],
    twicpics: {
      baseURL: 'https://nuxt-demo.twic.pics'
    },
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/nuxt/image/upload'
    },
    fastly: {
      baseURL: 'https://www.fastly.io'
    },
    imgix: {
      baseURL: 'https://assets.imgix.net'
    },
    imagekit: {
      baseURL: 'https://ik.imagekit.io/demo'
    },
    presets: [
      {
        name: 's50',
        modifiers: {
          width: 50,
          height: 50
        }
      }
    ],
    intersectOptions: {
      rootMargin: '50px'
    }
  }
}
