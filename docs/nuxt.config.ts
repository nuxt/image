// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: process.env.NUXT_ELEMENTS_PATH || '@nuxthq/elements',
  modules: [
    '@nuxt/image',
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxthq/studio',
    '@vueuse/nuxt',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    '@nuxtjs/plausible',
    'nuxt-og-image',
  ],
  colorMode: {
    preference: 'dark'
  },
  ui: {
    icons: ['heroicons', 'simple-icons', 'ph'],
  },
  fontMetrics: {
    fonts: ['DM Sans'],
  },
  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'DM+Sans': [400, 500, 600, 700],
    },
  },
  experimental: {
    headNext: true
  },
  nitro: {
    prerender: {
      routes: ['/api/search.json'],
      autoSubfolderIndex: false
    }
  },
  routeRules: {
    '/get-started': { redirect: { to: '/get-started/installation', statusCode: 301 } },
    '/configuration': { redirect: { to: '/get-started/configuration', statusCode: 301 } },
    '/providers/introduction': { redirect: { to: '/get-started/providers', statusCode: 301 } },
    '/components/nuxt-img': { redirect: { to: '/usage/nuxt-img', statusCode: 301 } },
    '/components/nuxt-picture': { redirect: { to: '/usage/nuxt-picture', statusCode: 301 } },
    '/api/use-image': { redirect: { to: '/usage/use-image', statusCode: 301 } },
  },
})
