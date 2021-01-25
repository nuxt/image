import { withDocus } from 'docus'
import imageModule from '../src/module'

export default withDocus({
  loading: { color: '#00DC82' },
  buildModules: [
    // https://github.com/bdrtsky/nuxt-ackee
    'nuxt-ackee',
    '@nuxt/typescript-build',
    imageModule,
  ],
  image: {
    accept: ['images.unsplash.com'],
    local: {
      dir: `~~/static`
    },
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/nuxt/image/upload/'
    },
    presets: {
      cover: {
        modifiers: {
          fit: 'cover',
          format: 'jpg',
          width: 300,
          height: 300
        }
      },
      avatar: {
        modifiers: {
          format: 'jpg',
          width: 50,
          height: 50
        }
      }
    }
  },
  ackee: {
    server: 'https://ackee.nuxtjs.com',
    domainId: '0006b8b9-dec9-4d9c-b540-8954a119abb0',
    detailed: true
  }
})
