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
      local: {},
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
    domainId: '7e54dba4-1702-4c2a-9fb4-e0657449fb95',
    detailed: true
  }
})
