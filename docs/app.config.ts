export default defineAppConfig({
  docus: {
    url: 'https://image.nuxtjs.org',
    title: 'Nuxt Image',
    description: 'Plug-and-play image optimization for Nuxt apps. Resize and transform your images in your code using built-in optimizer or your favorite images CDN.',
    header: {
      logo: true
    },
    socials: {
      twitter: '@nuxt_js',
      github: 'nuxt/image',
      nuxt: {
        href: 'https://nuxt.com',
        icon: 'simple-icons:nuxtdotjs',
        label: 'Nuxt'
      }
    },
    aside: {
      level: 1
    },
    image: '/cover.jpg'
  }
})
