export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
  ],
  app: {
    head: {
      title: 'Nuxt Image Example',
    },
  },
  image: {
    domains: [
      'https://images.unsplash.com',
      'https://source.unsplash.com',
    ],
  },
})
