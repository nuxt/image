export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  compatibilityDate: '2024-08-27',
  image: {
    provider: 'ipx',
    ipx: {
      allowedInputFormats: ['jpeg', 'png', 'webp', 'gif', 'svg', 'avif', 'heic', 'tiff'],
    },
  },
})
