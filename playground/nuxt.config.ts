import type { NuxtConfig } from '@nuxt/types'
import type { } from '../src/types'

export default <NuxtConfig> {
  components: true,
  target: 'static',
  head: {
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  modules: [
    '../src/module.ts'
  ],
  buildModules: [
    '@nuxt/typescript-build'
  ],
  image: {
    domains: [
      'https://nuxtjs.org',
      'https://unsplash.com',
      'https://upload.wikimedia.org'
    ],
    twicpics: {
      baseURL: 'https://nuxt-demo.twic.pics'
    },
    storyblok: {
      baseURL: 'https://img2.storyblok.com'
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
    providers: {
      custom: {
        provider: '~/providers/custom',
        options: {
          baseURL: 'https://site.my'
        }
      }
    },
    presets: {
      s50: {
        modifiers: {
          width: 50,
          height: 50
        }
      }
    },
    intersectOptions: {
      rootMargin: '50px'
    }
  }
}
