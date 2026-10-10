import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  compatibilityDate: '2024-08-27',
  image: {
    provider: 'ipx',
    weserv: {
      baseURL: 'https://example.com',
    },
  },
})
