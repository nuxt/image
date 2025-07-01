export default defineAppConfig({
  header: {
    title: 'Nuxt Image',
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate',
    },
  },
  uiPro: {
    pageHero: {
      slots: {
        container: 'lg:!grid-cols-3',
        wrapper: 'col-span-2',
      },
    },
  },
  github: {
    rootDir: 'docs',
  },
  socials: {
    nuxt: 'https://nuxt.com',
    x: 'https://x.com/nuxt_js',
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      links: [
        {
          icon: 'i-ph-shooting-star-duotone',
          label: 'Star on GitHub',
          to: 'https://github.com/nuxt/image',
          target: '_blank',
        },
        {
          icon: 'i-ph-chat-centered-text-duotone',
          label: 'Chat on Discord',
          to: 'https://chat.nuxt.dev',
          target: '_blank',
        },
        {
          icon: 'i-ph-hand-heart-duotone',
          label: 'Become a Sponsor',
          to: 'https://github.com/sponsors/nuxt',
          target: '_blank',
        },
        {
          icon: 'i-simple-icons-nuxtdotjs',
          label: 'Nuxt docs',
          to: 'https://nuxt.com',
          target: '_blank',
        },
      ],
    },
  },
})
