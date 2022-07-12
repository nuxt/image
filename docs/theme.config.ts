import { defineTheme } from '@nuxt-themes/kit'

export default defineTheme({
  title: 'Nuxt Image',
  description: 'Plug-and-play image optimization for Nuxt apps. Resize and transform your images in your code using built-in optimizer or your favorite images CDN.',
  socials: {
    twitter: '@nuxt_js',
    github: 'nuxt/image',
    nuxt: {
      href: 'https://v3.nuxtjs.org',
      icon: 'simple-icons:nuxtdotjs',
      label: 'Nuxt'
    }
  },
  github: {
    root: 'docs/content'
  },
  footer: {
    icons: []
  }
})