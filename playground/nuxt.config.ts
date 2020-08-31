export default {
  components: true,
  modules: [
    '../src/module.ts'
  ],
  buildModules: [
    '@nuxt/typescript-build'
  ],
  image: {
    defaultProvider: 'twicpics',
    providers: {
      local: {},
      twicpics: {
        baseURL: 'https://i5acur1u.twic.pics/',
      },
    }
  }
}


