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
  // To by-pass .nuxtrc at the root
  imports: {
    autoImport: true
  }
})
