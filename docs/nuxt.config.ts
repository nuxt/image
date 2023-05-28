import { useNuxt } from 'nuxt/kit'

export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  modules: ['@nuxtjs/plausible'],
  hooks: {
    'modules:before' () {
      const nuxt = useNuxt()
      nuxt.options.modules = nuxt.options.modules.filter(m => m !== 'nuxt-vitest')
    }
  },
  content: {
    documentDriven: {
      host: 'https://image.nuxtjs.org'
    }
  },
  plausible: {
    domain: 'image.nuxtjs.org'
  },
})
