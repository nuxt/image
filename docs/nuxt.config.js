import { withDocus } from 'docus'

export default withDocus({
  loading: { color: '#00DC82' },
  buildModules: [
    // https://github.com/bdrtsky/nuxt-ackee
    'nuxt-ackee'
  ],
  ackee: {
    server: 'https://ackee.nuxtjs.com',
    domainId: '0006b8b9-dec9-4d9c-b540-8954a119abb0',
    detailed: true
  }
})
