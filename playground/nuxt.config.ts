import { defineNuxtConfig } from 'nuxt3'
import imageModule from '..'

export default defineNuxtConfig({
  // vite: false,
  buildModules: [imageModule],
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
      baseURL: 'https://img2.storyblok.com/'
    },
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/nuxt/image/upload/'
    },
    contentful: {},
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
