// @vitest-environment nuxt

import { describe, it, expect } from 'vitest'

import { images } from '../providers'

import { cleanDoubleSlashes } from '#image/utils'
import * as ipx from '#image/providers/ipx'
import * as none from '~/src/runtime/providers/none'
import * as weserv from '~/src/runtime/providers/weserv'
import * as aliyun from '#image/providers/aliyun'
import * as awsAmplify from '#image/providers/awsAmplify'
import * as cloudflare from '#image/providers/cloudflare'
import * as cloudinary from '#image/providers/cloudinary'
import * as twicpics from '#image/providers/twicpics'
import * as fastly from '#image/providers/fastly'
import * as prepr from '#image/providers/prepr'
import * as glide from '#image/providers/glide'
import * as imgix from '#image/providers/imgix'
import * as gumlet from '#image/providers/gumlet'
import * as imageengine from '#image/providers/imageengine'
import * as unsplash from '#image/providers/unsplash'
import * as imagekit from '#image/providers/imagekit'
import * as netlifyImageCdn from '#image/providers/netlifyImageCdn'
import * as netlifyLargeMedia from '#image/providers/netlifyLargeMedia'
import * as prismic from '#image/providers/prismic'
import * as sanity from '#image/providers/sanity'
import * as contentful from '#image/providers/contentful'
import * as cloudimage from '#image/providers/cloudimage'
import * as edgio from '#image/providers/edgio'
import * as layer0 from '#image/providers/layer0'
import * as storyblok from '#image/providers/storyblok'
import * as strapi from '#image/providers/strapi'
import * as strapi5 from '#image/providers/strapi5'
import * as vercel from '#image/providers/vercel'
import * as wagtail from '#image/providers/wagtail'
import * as uploadcare from '#image/providers/uploadcare'
import * as sirv from '#image/providers/sirv'
import * as hygraph from '#image/providers/hygraph'

const emptyContext = {
  options: {
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
      '2xl': 1536,
    },
    nuxt: useNuxtApp(),
  },
} as any

describe('Providers', () => {
  it('ipx', () => {
    const providerOptions = {}

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = ipx.getImage(src, { modifiers: { ...modifiers }, ...providerOptions }, emptyContext)
      generated.url = cleanDoubleSlashes(generated.url)
      expect(generated).toMatchObject(image.ipx)
    }
  })

  it('ipx router base', () => {
    const context = { ...emptyContext }

    const src = '/images/test.png'
    const generated = ipx.getImage(src, { modifiers: {} }, context)
    generated.url = cleanDoubleSlashes(generated.url)
    expect(generated).toMatchObject({
      url: '/_ipx/_/images/test.png',
    })
  })
  it('aliyun', () => {
    const providerOptions = {
      baseURL: '/',
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = aliyun.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.aliyun)
    }
  })
  it('awsAmplify', () => {
    const providerOptions = {
      baseURL: '/',
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = awsAmplify.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.awsAmplify)
    }
  })
  it('cloudflare', () => {
    const providerOptions = {
      baseURL: '/',
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = cloudflare.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.cloudflare)
    }
  })

  it('cloudinary', () => {
    const providerOptions = {
      baseURL: '/',
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = cloudinary.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.cloudinary)
    }
  })

  it('cloudinary absolute url', () => {
    const absoluteUrl = 'https://res.cloudinary.com/example/image/upload/test.png'
    const generated = cloudinary.getImage(absoluteUrl, { modifiers: { width: 300, height: 300 } }, emptyContext)
    expect(generated).toMatchObject({
      url: 'https://res.cloudinary.com/example/image/upload/f_auto,q_auto,w_300,h_300/test.png',
    })
  })

  it('cloudinary fetch', () => {
    const providerOptions = {
      baseURL: 'https://res.cloudinary.com/demo/image/fetch/',
    }
    // see: https://cloudinary.com/documentation/fetch_remote_images#remote_image_fetch_url
    const remoteUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'
    const generated = cloudinary.getImage(
      remoteUrl,
      {
        modifiers: {
          width: 300,
          height: 300,
        },
        ...providerOptions,
      }, emptyContext,
    )
    expect(generated).toMatchObject({
      url: `https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto,w_300,h_300/${remoteUrl}`,
    })
  })

  it('cloudinary blur param', () => {
    const providerOptions = {
      baseURL: 'https://res.cloudinary.com/demo/image/fetch/',
    }
    // see: https://cloudinary.com/documentation/fetch_remote_images#remote_image_fetch_url
    const remoteUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'
    const generated = cloudinary.getImage(
      remoteUrl,
      {
        modifiers: {
          blur: 100,
        },
        ...providerOptions,
      }, emptyContext,
    )
    expect(generated).toMatchObject({
      url: `https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto,e_blur:100/${remoteUrl}`,
    })
  })

  it('cloudinary upload', () => {
    const providerOptions = {
      baseURL: 'https://res.cloudinary.com/demo/image/upload/remote',
    }
    const generated = cloudinary.getImage(
      '/1/13/Benedict_Cumberbatch_2011.png',
      {
        modifiers: {
          width: 300,
          height: 300,
        },
        ...providerOptions,
      }, emptyContext,
    )
    expect(generated).toMatchObject({
      url: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_300,h_300/remote/1/13/Benedict_Cumberbatch_2011.png',
    })
  })

  it('twicpics', () => {
    const providerOptions = {
      baseURL: '',
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = twicpics.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.twicpics)
    }
  })

  it('glide', () => {
    const providerOptions = {
      baseURL: '',
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = glide.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.glide)
    }
  })

  it('fastly', () => {
    const providerOptions = {
      baseURL: '',
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = fastly.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.fastly)
    }
  })

  it('gumlet', () => {
    const providerOptions = {
      baseURL: '',
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = gumlet.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.gumlet)
    }
  })

  it('imgix', () => {
    const providerOptions = {
      baseURL: '',
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = imgix.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.imgix)
    }
  })

  it('imageengine', () => {
    const providerOptions = {
      baseURL: '',
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = imageengine.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.imageengine)
    }
  })

  it('imageengine compression', () => {
    const providerOptions = {
      baseURL: 'https://foo.bar.com',
    }
    const generated = imageengine.getImage(
      '/test.jpg',
      {
        modifiers: {
          width: 150,
          quality: 0,
        },
        ...providerOptions,
      }, emptyContext,
    )
    expect(generated).toMatchObject({
      url: 'https://foo.bar.com/test.jpg?imgeng=/w_150/cmpr_99',
    })
  })

  it('imageengine modifiers', () => {
    const providerOptions = {
      baseURL: 'https://foo.bar.com',
    }
    
    const testCases = [
      {
        input: {
          src: '/test.jpg',
          modifiers: {
            width: 150,
            quality: 0,
          }
        },
        expected: {
          url: 'https://foo.bar.com/test.jpg?imgeng=/w_150/cmpr_99',
        }
      },
      {
        input: {
          src: '/product.jpg',
          modifiers: {
            width: 500,
            height: 500,
            fit: 'productletterbox_bg_ffffff_a_80_tol_25'
          }
        },
        expected: {
          url: 'https://foo.bar.com/product.jpg?imgeng=/w_500/h_500/m_productletterbox_bg_ffffff_a_80_tol_25'
        }
      },
      {
        input: {
          src: '/image.jpg',
          modifiers: {
            width: 300,
            maxDpr: 2
          }
        },
        expected: {
          url: 'https://foo.bar.com/image.jpg?imgeng=/w_300/maxdpr_2'
        }
      },
      {
        input: {
          src: '/download.jpg',
          modifiers: {
            download: true,
            width: 800
          }
        },
        expected: {
          url: 'https://foo.bar.com/download.jpg?imgeng=/dl_true/w_800'
        }
      }
    ]

    for (const { input, expected } of testCases) {
      const generated = imageengine.getImage(
        input.src,
        {
          modifiers: input.modifiers,
          ...providerOptions,
        },
        emptyContext
      )
      expect(generated).toMatchObject(expected)
    }
  })

  it('unsplash', () => {
    const providerOptions = {
      baseURL: '',
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = unsplash.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.unsplash)
    }
  })

  it('imagekit', () => {
    const providerOptions = {
      baseURL: '',
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = imagekit.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.imagekit)
    }
  })

  it('netlifyImageCdn', () => {
    const providerOptions = {
      baseURL: '',
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = netlifyImageCdn.getImage(src, { modifiers: { ...modifiers }, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.netlifyImageCdn)
    }
  })

  it('netlifyLargeMedia', () => {
    const providerOptions = {
      baseURL: '',
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = netlifyLargeMedia.getImage(src, { modifiers: { ...modifiers }, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.netlifyLargeMedia)
    }
  })

  it('prismic', () => {
    const providerOptions = {
      baseURL: '', // Use empty base URL for the sake of simplicity
    }

    const EXISTING_QUERY_PARAMETERS
      = '?auto=compress,format&rect=0,0,200,200&w=100&h=100'

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = prismic.getImage(`${src}${EXISTING_QUERY_PARAMETERS}`, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.prismic)
    }
  })

  it('prismic (unsplash)', () => {
    const providerOptions = {
      baseURL: '', // Use empty base URL for the sake of simplicity
    }

    const EXISTING_QUERY_PARAMETERS
      = '?auto=compress,format&rect=0,0,200,200&w=100&h=100'

    for (const image of images) {
      const [, modifiers] = image.args
      const generated = prismic.getImage(`${image.prismicUnsplash.url.split('?').shift()}${EXISTING_QUERY_PARAMETERS}`, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.prismicUnsplash)
    }
  })

  it('sanity', () => {
    const providerOptions = {
      baseURL: '',
      projectId: 'projectid',
    }

    for (const image of images) {
      const [, modifiers] = image.args
      const generated = sanity.getImage('image-test-300x450-png', { modifiers: { ...modifiers }, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.sanity)
    }
  })

  it('prepr', () => {
    const providerOptions = {
      projectName: 'projectName',
    }

    for (const image of images) {
      const [, modifiers] = image.args
      const generated = prepr.getImage('image-test-300x450-png', { modifiers: { ...modifiers }, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.prepr)
    }
  })
  it('contentful', () => {
    const providerOptions = {
      baseURL: '',
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = contentful.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.contentful)
    }
  })

  it('cloudimage', () => {
    const providerOptions = {
      token: 'demo',
      apiVersion: 'v7',
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = cloudimage.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.cloudimage)
    }
  })

  it('edgio', () => {
    const providerOptions = {}

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = edgio.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.edgio)
    }
  })

  it('layer0', () => {
    expect(layer0.getImage).toBe(edgio.getImage)
  })

  it('storyblok', () => {
    const providerOptions = {}

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = storyblok.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.storyblok)
    }
  })

  it('strapi', () => {
    const test = {
      '': 'http://localhost:1337/uploads/test.png',
      'break': 'http://localhost:1337/uploads/break_test.png',
    }

    for (const [breakpoint, expected] of Object.entries(test)) {
      const generated = strapi.getImage('/test.png', { modifiers: { breakpoint } }, emptyContext)
      expect(generated.url).toBe(expected)
    }
  })

  it('strapi5', () => {
    const tests = [
      {
        modifiers: {
          breakpoint: 'large',
          formats: {
            thumbnail: {
              url: '/uploads/thumbnail_test.png',
            },
            small: {
              url: '/uploads/small_test.png',
            },
            medium: {
              url: '/uploads/medium_test.png',
            },
            large: {
              url: '/uploads/large_test.png',
            },
          },
        },
        expected: 'http://localhost:1337/uploads/large_test.png',
      },
      {
        modifiers: {
          breakpoint: 'medium',
          formats: {
            thumbnail: {
              url: '/uploads/thumbnail_test.png',
            },
            small: {
              url: '/uploads/small_test.png',
            },
            medium: {
              url: '/uploads/medium_test.png',
            },
            large: {
              url: '/uploads/large_test.png',
            },
          },
        },
        expected: 'http://localhost:1337/uploads/medium_test.png',
      },
      {
        modifiers: {
          breakpoint: 'large',
          formats: {
            thumbnail: {
              url: '/uploads/thumbnail_test.png',
            },
            small: {
              url: '/uploads/small_test.png',
            },
          },
        },
        expected: 'http://localhost:1337/uploads/small_test.png',
      },
      {
        modifiers: {
          breakpoint: 'large',
        },
        expected: 'http://localhost:1337/uploads/test.png',
      },
      {
        modifiers: {
          breakpoint: 'custom',
          formats: {
            thumbnail: {
              url: '/uploads/thumbnail_test.png',
            },
            small: {
              url: '/uploads/small_test.png',
            },
            custom: {
              url: '/uploads/custom_test.png',
            },
            medium: {
              url: '/uploads/medium_test.png',
            },
            large: {
              url: '/uploads/large_test.png',
            },
          },
          breakpoints: ['large', 'medium', 'custom', 'small', 'thumbnail'],
        },
        expected: 'http://localhost:1337/uploads/custom_test.png',
      },
      {
        modifiers: {
          breakpoint: 'medium',
          formats: {
            thumbnail: {
              url: '/uploads/thumbnail_test.png',
            },
            small: {
              url: '/uploads/small_test.png',
            },
            custom: {
              url: '/uploads/custom_test.png',
            },
          },
          breakpoints: ['large', 'medium', 'custom', 'small', 'thumbnail'],
        },
        expected: 'http://localhost:1337/uploads/custom_test.png',
      },
    ]

    for (const { modifiers, expected } of tests) {
      const generated = strapi5.getImage('/test.png', { modifiers }, emptyContext)
      expect(generated.url).toBe(expected)
    }
  })

  it('vercel', () => {
    const providerOptions = {
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = vercel.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.vercel)
    }
  })

  it('wagtail', () => {
    const providerOptions = {}
    const testImageId = '329944'
    for (const image of images) {
      const [_src, modifiers] = image.args
      const generated = wagtail.getImage(testImageId, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.wagtail)
    }
  })

  it('uploadcare', () => {
    const providerOptions = {}
    const testImageId = 'c160afba-8b42-45a9-a46a-d393248b0072'
    for (const image of images) {
      const generated = uploadcare.getImage(testImageId, { modifiers: { ...image.args[1] }, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.uploadcare)
    }
  })

  it('sirv', () => {
    const providerOptions = {
      baseURL: 'https://demo.sirv.com',
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = sirv.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.sirv)
    }
  })

  it('hygraph', () => {
    const providerOptions = {
      baseURL: 'https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/',
    }
    for (const image of images) {
      const [_src, modifiers] = image.args
      const generated = hygraph.getImage('https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/cltsrex89477t08unlckqx9ue', { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.hygraph)
    }
  })

  it('weserv', () => {
    const providerOptions = {
      baseURL: 'https://my-website.com/',
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = weserv.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.weserv)
    }

    const generated = weserv.getImage('test.png', {}, emptyContext)
    expect(generated).toMatchObject({ url: 'test.png' })
  })

  it('none', () => {
    const providerOptions = {
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = none.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.none)
    }
  })
})
