import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  extends: ['./layers/example'],
  image: {
    inject: true,
    domains: [
      'https://nuxtjs.org',
      'https://images.unsplash.com',
      'https://upload.wikimedia.org'
    ],
    screens: {
      750: 750
    },
    none: {},
    ipx: {
      sharpOptions: {
        animated: true
      },
      maxAge: 50,
      fs: { maxAge: 51 },
      http: { maxAge: 52 }
    },
    alias: {
      unsplash: 'https://images.unsplash.com', // ipx
      blog: '/remote/nuxt-org/blog' // cloudinary
    },
    aliyun: {
      baseURL: 'https://assets.yanbot.tech'
    },
    awsAmplify: {
      baseURL: 'https://example.amplifyapp.com/_amplify/image'
    },
    bunny: {
      baseURL: 'https://bunnyoptimizerdemo.b-cdn.net'
    },
    twicpics: {
      baseURL: 'https://demo.twic.pics/'
    },
    storyblok: {
      baseURL: 'https://a.storyblok.com/'
    },
    wagtail: {
      baseURL: 'https://cms.demo.nypr.digital/images/'
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
      baseURL: 'sample.li',
      apiVersion: 'v7'
    },
    directus: {
      baseURL: 'http://localhost:8055/assets/'
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
    prepr: {
      projectName: 'nuxt-prepr-demo'
    },
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
    sirv: {
      baseURL: 'https://demo.sirv.com'
    },
    hygraph: {
      baseURL: 'https://media.graphassets.com'
    },
    weserv: {
      baseURL: '/'
    },
    caisy: {
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
  },
  nitro: {
    prerender: {
      failOnError: false
    }
  }
})
