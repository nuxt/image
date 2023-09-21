// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: '@nuxt/ui-pro',
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
  devtools: { enabled: true },
  colorMode: {
    preference: 'dark',
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
  nitro: {
    prerender: {
      routes: ['/api/search.json'],
      autoSubfolderIndex: false,
    },
  },
  routeRules: {
    '/get-started': { redirect: { to: '/get-started/installation', statusCode: 301 } },
    '/configuration': { redirect: { to: '/get-started/configuration', statusCode: 301 } },
    '/providers/introduction': { redirect: { to: '/get-started/providers', statusCode: 301 } },
    '/components/nuxt-img': { redirect: { to: '/usage/nuxt-img', statusCode: 301 } },
    '/components/nuxt-picture': { redirect: { to: '/usage/nuxt-picture', statusCode: 301 } },
    '/api/use-image': { redirect: { to: '/usage/use-image', statusCode: 301 } },
  },
  hooks: {
    // Related to https://github.com/nuxt/nuxt/pull/22558
    // Adding all global components to the main entry
    // To avoid lagging during page navigation on client-side
    // Downside: bigger JS bundle
    // With sync: 465KB, gzip: 204KB
    // Without: 418KB, gzip: 184KB
    'components:extend': function (components) {
      for (const comp of components) {
        if (comp.global)
          comp.global = 'sync'
      }
    },
  },
})
