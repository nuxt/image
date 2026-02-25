export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['@nuxtjs/plausible'],
  css: ['~/assets/css/main.css'],
  site: {
    name: 'Nuxt Image',
  },
  compatibilityDate: '2025-08-07',
  nitro: {
    cloudflare: {
      pages: {
        routes: {
          exclude: [
            '/get-started/*',
            '/usage/*',
            '/providers/*',
            '/advanced/*',
            '/playground',
            '/__nuxt_content/*',
            '/raw/*',
          ],
        },
      },
    },
  },
  llms: {
    domain: 'https://image.nuxt.com',
    description: 'Nuxt Image is a module for Nuxt to optimize image for best performance.',
  },
  mcp: {
    name: 'Nuxt Image',
  },
})
