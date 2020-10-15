export default {
  components: true,
  modules: [
    '../src/index.ts'
  ],
  buildModules: [
    '@nuxt/typescript-build'
  ],
  image: {
    defaultProvider: 'local',
    presets: [
      {
        name: 's50',
        modifiers: {
          width: 50,
          height: 50
        }
      }
    ],
    providers: {
      local: {},
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
      }
    },
    intersectOptions: {
      rootMargin: '50px'
    }
  }
}
