import { withDocus } from 'docus'

export default withDocus({
  rootDir: __dirname,
  socialImage: {
    baseUrl: 'https://image.nuxtjs.org',
    chrome: {
      browserWSEndpoint: 'wss://chrome.browserless.io/'
    }
  },
  buildModules: ['vue-plausible'],
  plausible: {
    domain: 'image.nuxtjs.org'
  }
})
