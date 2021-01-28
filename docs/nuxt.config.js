import { withDocus } from 'docus'

export default withDocus({
  docus: {
    colors: {
      primary: '#00DC82'
    }
  },
  buildModules: [
    'vue-plausible'
  ],
  plausible: {
    domain: 'image.nuxtjs.org',
  }
})
