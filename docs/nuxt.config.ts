export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  modules: ['nuxt-plausible'],
  plausible: {
    domain: 'image.nuxtjs.org'
  },
  // To by-pass .npmrc at the root
  imports: {
    autoImport: true
  }
})
