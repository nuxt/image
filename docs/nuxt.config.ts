import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  extends: ['./node_modules/@docus/docs-theme'],
  modules: ['@nuxthq/admin', '@docus/github', 'vue-plausible'],
  github: {
    owner: 'nuxt',
    repo: 'image',
    branch: 'main'
  },
  theme: {},
  plausible: {
    domain: 'image.nuxtjs.org'
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#d6ffee',
              100: '#acffdd',
              200: '#83ffcc',
              300: '#30ffaa',
              400: '#00dc82',
              500: '#00bd6f',
              600: '#009d5d',
              700: '#007e4a',
              800: '#005e38',
              900: '#003f25'
            }
          }
        }
      }
    }
  }
})
