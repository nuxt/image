import path from 'path'
import theme from '@nuxt/content-theme-docs'

export default theme({
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
  },
  loading: { color: '#00DC82' },
  buildModules: [
    '@nuxt/typescript-build',
    // https://github.com/bdrtsky/nuxt-ackee
    'nuxt-ackee'
  ],
  modules: [
    '../src/module'
  ],
  ackee: {
    server: 'https://ackee.nuxtjs.com',
    domainId: '7e54dba4-1702-4c2a-9fb4-e0657449fb95',
    detailed: true
  },
  image: {
    presets: [
      {
        name: 'jpg-cover',
        modifiers: {
          size: 'cover',
          format: 'jpg'
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
    ],
    providers: {
      local: {
        dir: path.join(__dirname, 'static')
      },
      cloudinary: {
        baseURL: 'https://res.cloudinary.com/nuxt/image/upload/'
      },
      random: __dirname + '/plugins/random'
    }
  },
  build: {
    transpile: [
      __dirname + '/plugins/'
    ]
  }
})
