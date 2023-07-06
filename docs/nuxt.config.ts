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
  routeRules: {
    '/providers/layer0': { redirect: '/providers/edgio' }
  }
})
