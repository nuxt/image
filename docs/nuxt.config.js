import theme from '@nuxt/content-theme-docs'

export default theme({
  loading: { color: '#00DC82' },
  buildModules: [
    // https://github.com/bdrtsky/nuxt-ackee
    'nuxt-ackee'
  ],
  modules: [
    '@nuxt/image'
  ],
  image: {
    providers: {
      cloudinary: {
        baseURL: 'https://res.cloudinary.com/nuxt/image/upload/'
      },
      random: '~~/providers/random'
    },
    presets: [
      {
        name: 'jpg-cover',
        modifiers: {
          fit: 'cover',
          format: 'jpg',
          width: 300,
          height: 300
        }
      },
      {
        name: 'avatar',
        modifiers: {
          format: 'jpg',
          width: 50,
          height: 50
        }
      }
    ]
  },
  ackee: {
    server: 'https://ackee.nuxtjs.com',
    domainId: '0006b8b9-dec9-4d9c-b540-8954a119abb0',
    detailed: true
  }
})
