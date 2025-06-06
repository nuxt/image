export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s - Nuxt Image',
    },
  },
  css: ['./app/assets/css/main.css'],
  future: {
    compatibilityVersion: 4,
  },
})
