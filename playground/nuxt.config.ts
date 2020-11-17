export default {
  components: true,
  target: 'static',
  modules: [
    '../src/index.ts'
  ],
  buildModules: [
    '@nuxt/typescript-build'
  ],
  image: {
    accept: ['nuxtjs.org'],
    twicpics: {
      baseURL: 'https://i5acur1u.twic.pics'
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
