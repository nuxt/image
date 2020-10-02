export default {
  components: true,
  modules: [
    '../src/module.ts'
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
          contain: '50x50'
        }
      }
    ],
    providers: {
      local: {},
      twicpics: {
        baseURL: 'https://i5acur1u.twic.pics'
      },
      cloudinary: {
        baseURL: 'https://res.cloudinary.com/farnabaz/image/upload'
      }
    }
  }
}
