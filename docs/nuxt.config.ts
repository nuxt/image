export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  modules: ['@nuxtjs/plausible'],
  content: {
    documentDriven: {
      host: 'https://image.nuxtjs.org'
    }
  },
  plausible: {
    domain: 'image.nuxtjs.org'
  },
  nitro: {
    prerender: {
      ignore: ['/__pinceau_tokens_config.json', '/__pinceau_tokens_schema.json']
    }
  },
  routeRules: {
    '/providers/layer0': { redirect: '/providers/edgio' }
  }
})
