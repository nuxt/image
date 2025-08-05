export default defineNuxtConfig({

  modules: ['@nuxtjs/plausible'],
  css: ['../app/assets/css/main.css'],

  site: {
    name: 'Nuxt Image',
  },

  future: {
    compatibilityVersion: 4,
  },

  llms: {
    domain: 'https://image.nuxt.com',
    description: 'Nuxt Image is a module for Nuxt to optimize image for best performance.',
  },
})
