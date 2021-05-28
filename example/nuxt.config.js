export default {
  components: true,
  head: {
    title: 'Nuxt Image Example',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ]
  },
  modules: [
    '@nuxt/image'
  ],
  image: {
    domains: ['https://images.unsplash.com', 'https://source.unsplash.com']
  }
}
