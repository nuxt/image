export default defineAppConfig({
  docus: {
    url: 'https://image.nuxtjs.org',
    description: 'Plug-and-play image optimization for Nuxt apps. Resize and transform your images in your code using built-in optimizer or your favorite images CDN.',
    header: {
      title: false,
      logo: true
    },
    socials: {
      twitter: '@nuxt_js',
      github: 'nuxt/image',
      nuxt: {
        href: 'https://v3.nuxtjs.org',
        icon: 'simple-icons:nuxtdotjs',
        label: 'Nuxt'
      }
    },
    image: '/cover.jpg'
  }
})
