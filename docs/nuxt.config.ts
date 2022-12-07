export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  app: {
    head: {
      script: [
        {
          defer: true,
          'data-domain': 'image.nuxtjs.org',
          src: 'https://plausible.io/js/script.js'
        }
      ]
    }
  }
})
