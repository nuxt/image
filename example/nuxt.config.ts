export default defineNuxtConfig({
  app: {
    head: {
      title: 'Nuxt Image Example'
    }
  },
  modules: [
    '@nuxt/image'
  ],
  image: {
    domains: [
      'https://images.unsplash.com',
      'https://source.unsplash.com'
    ]
  }
})
