export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s - Nuxt Image',
    },
  },
  css: ['./app/assets/css/main.css'],
  site: {
    name: 'Nuxt Image',
  },
  future: {
    compatibilityVersion: 4,
  },
})
