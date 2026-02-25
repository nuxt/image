import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['./layers/example'],
  modules: ['@nuxt/image'],
  compatibilityDate: '2024-08-27',
  nitro: {
    prerender: {
      failOnError: false,
    },
  },
  image: {
    inject: true,
    domains: [
      'https://nuxtjs.org',
      'https://images.unsplash.com',
      'https://upload.wikimedia.org',
    ],
    format: ['webp', 'jpg', 'jpeg'],
    densities: [1, 2, 3, 4],
    screens: {
      'sm': 640,
      '750': 750,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536,
    },
    none: {},
    ipx: {
      sharpOptions: {
        animated: true,
      },
      maxAge: 50,
      fs: { maxAge: 51 },
      http: { maxAge: 52 },
    },
    alias: {
      unsplash: 'https://images.unsplash.com', // ipx
      blog: '/remote/nuxt-org/blog', // cloudinary
    },
    aliyun: {
      baseURL: 'https://assets.yanbot.tech',
    },
    awsAmplify: {
      baseURL: 'https://example.amplifyapp.com/_amplify/image',
    },
    bunny: {
      baseURL: 'https://bunnyoptimizerdemo.b-cdn.net',
    },
    builderio: {},
    twicpics: {
      baseURL: 'https://demo.twic.pics/',
    },
    storyblok: {
      baseURL: 'https://a.storyblok.com/',
    },
    wagtail: {
      baseURL: 'https://cms.demo.nypr.digital/images/',
    },
    cloudflare: {
      baseURL: 'https://that-test.site',
    },
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/nuxt/image/upload/',
    },
    contentful: {},
    cloudimage: {
      token: 'demo',
      baseURL: 'sample.li',
      apiVersion: 'v7',
    },
    directus: {
      baseURL: 'http://localhost:8055/assets/',
    },
    fastly: {
      baseURL: 'https://www.fastly.io',
    },
    filerobot: {
      baseURL: 'https://fesrinkeb.filerobot.com/',
    },
    github: {},
    glide: {
      baseURL: 'https://glide.herokuapp.com/1.0/',
    },
    gumlet: {
      baseURL: 'https://demo.gumlet.io',
    },
    imgix: {
      baseURL: 'https://assets.imgix.net',
    },
    imagekit: {
      baseURL: 'https://ik.imagekit.io/demo',
    },
    netlifyImageCdn: {
      baseURL: 'https://netlify-photo-gallery.netlify.app/.netlify/images',
    },
    netlifyLargeMedia: {
      baseURL: 'https://netlify-photo-gallery.netlify.app',
    },
    prismic: {},
    picsum: {},
    prepr: {
      projectName: 'nuxt-prepr-demo',
    },
    sanity: {
      projectId: 'zp7mbokg',
    },
    shopify: {
      baseURL: 'https://cdn.shopify.com/',
    },
    strapi: {
      baseURL: 'http://localhost:1337/uploads/',
    },
    strapi5: {
      baseURL: 'http://localhost:1337/uploads/',
    },
    supabase: {
      baseURL: 'https://ovzjdhllnxrizgszqlsi.supabase.co/storage/v1/render/image/public/nuxt',
    },
    unsplash: {},
    vercel: {
      baseURL: 'https://image-component.nextjs.gallery/_next/image',
    },
    imageengine: {
      baseURL: 'https://abc123.imgeng.in',
    },
    uploadcare: {
    },
    sirv: {
      baseURL: 'https://demo.sirv.com',
    },
    hygraph: {
      baseURL: 'https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/',
    },
    weserv: {
      baseURL: '/',
    },
    caisy: {
    },
    providers: {
      custom: {
        provider: '~/providers/custom',
        options: {
          baseURL: 'https://site.my',
        },
      },
    },
    presets: {
      s50: {
        modifiers: {
          width: 50,
          height: 50,
        },
      },
    },
  },
})
