import { withDocus } from '@docus/app'

export default withDocus({
  rootDir: __dirname,
  buildModules: [
    '@nuxt/typescript-build',
    'vue-plausible',
    '@docus/twitter',
    '@docus/github'
  ],
  vite: {
    server: {
      fs: {
        strict: false
      }
    },
    optimizeDeps: {
      exclude: ['vue-demi', 'scule', '@vueuse/integrations', 'ohmyfetch'],
      include: [
        'defu',
        'theme-colors',
        'cookie',
        'js-cookie',
        'clipboard',
        'property-information',
        'ufo'
      ]
    }
  },
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Nuxt/Image' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'twitter:site', name: 'twitter:site', content: '@nuxt_js' },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://image.nuxtjs.org/social.png'
      },
      {
        hid: 'og:image:secure_url',
        property: 'og:image:secure_url',
        content: 'https://image.nuxtjs.org/social.png'
      },
      {
        hid: 'og:image:alt',
        property: 'og:image:alt',
        content: 'Nuxt/Image'
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: 'https://image.nuxtjs.org/social.png'
      }
    ]
  },
  plausible: {
    domain: 'image.nuxtjs.org'
  },
  build: {
    transpile: ['ohmyfetch'],
    loaders: {
      imgUrl: { limit: 0 }
    }
  }
})
