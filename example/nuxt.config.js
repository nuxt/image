export default {
  head: {
    title: 'Nuxt Image Example'
  },
  modules: [
    '@nuxt/image-edge'
  ],
  image: {
    domains: [
      'https://images.unsplash.com',
      'https://source.unsplash.com'
    ]
  }
}
