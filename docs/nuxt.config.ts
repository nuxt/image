import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  modules: [
    // '@nuxtlabs/github-module'
  ],
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
  },
  github: {
    owner: 'nuxt',
    repo: 'image',
    branch: 'v1',
    releases: false,
    contributors: false
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
