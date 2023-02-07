import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '../src/module'
  ],
  image: {
    domains: [
      'https://nuxtjs.org',
      'https://images.unsplash.com',
      'https://upload.wikimedia.org'
    ],
    screens: {
      750: 750
    },
    alias: {
      unsplash: 'https://images.unsplash.com', // ipx
      blog: '/remote/nuxt-org/blog' // cloudinary
    },
    twicpics: {
      baseURL: 'https://demo.twic.pics/'
    },
    storyblok: {
      baseURL: 'https://a.storyblok.com/'
    },
    cloudflare: {
      baseURL: 'https://that-test.site'
    },
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/nuxt/image/upload/'
    },
    contentful: {},
    cloudimage: {
      token: 'demo',
      baseURL: 'sample.li'
    },
    fastly: {
      baseURL: 'https://www.fastly.io'
    },
    glide: {
      baseURL: 'https://glide.herokuapp.com/1.0/'
    },
    gumlet: {
      baseURL: 'https://demo.gumlet.io'
    },
    imgix: {
      baseURL: 'https://assets.imgix.net'
    },
    imagekit: {
      baseURL: 'https://ik.imagekit.io/demo'
    },
    netlify: {
      baseURL: 'https://netlify-photo-gallery.netlify.app'
    },
    layer0: {
      baseURL: 'https://opt.moovweb.net'
    },
    edgio: {
      baseURL: 'https://opt.moovweb.net'
    },
    prismic: {},
    sanity: {
      projectId: 'zp7mbokg'
    },
    strapi: {
      baseURL: 'http://localhost:1337/uploads/'
    },
    unsplash: {},
    vercel: {
      baseURL: 'https://image-component.nextjs.gallery/_next/image'
    },
    imageengine: {
      baseURL: 'https://abc123.imgeng.in'
    },
    uploadcare: {
    },
    providers: {
      custom: {
        provider: '~/providers/custom',
        options: {
          baseURL: 'https://site.my'
        }
      }
    },
    presets: {
      s50: {
        modifiers: {
          width: 50,
          height: 50
        }
      }
    }
  }
})
