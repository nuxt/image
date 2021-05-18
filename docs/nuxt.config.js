import { resolve } from 'path'
import { withDocus } from 'docus'

export default withDocus({
  rootDir: resolve(__dirname),
  windicss: {
    root: resolve(__dirname)
  },
  socialImage: {
    baseUrl: 'DOMIN',
    chrome: {
      browserWSEndpoint: 'wss://chrome.browserless.io/'
    }
  },
  buildModules: ['vue-plausible'],
  plausible: {
    domain: 'image.nuxtjs.org'
  },
  hooks: {
    ready(ctx) {
      // console.log(ctx)
      console.log(ctx.options.windicss)
    }
  }
})
