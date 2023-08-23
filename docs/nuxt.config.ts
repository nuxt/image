// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: process.env.NUXT_ELEMENTS_PATH || '@nuxthq/elements',
  modules: [
    '@nuxt/image',
    '@nuxt/content',
    '@nuxthq/ui',
    '@vueuse/nuxt',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    '@nuxtjs/plausible',
    'nuxt-og-image',
  ],
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
      concurrency: 1,
      routes: ['/api/search.json']
    }
  },
  hooks: {
    // Related to https://github.com/nuxt/nuxt/pull/22558
    // Adding all global components to the main entry
    // To avoid lagging during page navigation on client-side
    // Downside: bigger JS bundle
    // With sync: 465KB, gzip: 204KB
    // Without: 418KB, gzip: 184KB
    'components:extend': (components) => {
      components.forEach((component) => {
        if (component.global) {
          component.global = 'sync'
        }
      })
    }
  }
})
