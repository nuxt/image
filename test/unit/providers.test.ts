// @vitest-environment nuxt

import { describe, it, expect } from 'vitest'

import { images } from '../providers'

import { cleanDoubleSlashes } from '../../src/runtime/utils'
import * as ipx from '../../src/runtime/providers/ipx'
import * as cloudflare from '../../src/runtime/providers/cloudflare'
import * as cloudinary from '../../src/runtime/providers/cloudinary'
import * as twicpics from '../../src/runtime/providers/twicpics'
import * as fastly from '../../src/runtime/providers/fastly'
import * as glide from '../../src/runtime/providers/glide'
import * as imgix from '../../src/runtime/providers/imgix'
import * as gumlet from '../../src/runtime/providers/gumlet'
import * as imageengine from '../../src/runtime/providers/imageengine'
import * as unsplash from '../../src/runtime/providers/unsplash'
import * as imagekit from '../../src/runtime/providers/imagekit'
import * as netlify from '../../src/runtime/providers/netlify'
import * as prismic from '../../src/runtime/providers/prismic'
import * as sanity from '../../src/runtime/providers/sanity'
import * as contentful from '../../src/runtime/providers/contentful'
import * as cloudimage from '../../src/runtime/providers/cloudimage'

const emptyContext = {
  options: {
    nuxt: useNuxtApp()
  }
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
      url: '/_ipx/_/images/test.png'
    })
  })

  it('cloudflare', () => {
    const providerOptions = {
      baseURL: '/'
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = cloudflare.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.cloudflare)
    }
  })

  it('cloudinary', () => {
    const providerOptions = {
      baseURL: '/'
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = cloudinary.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.cloudinary)
    }
  })

  it('cloudinary fetch', () => {
    const providerOptions = {
      baseURL: 'https://res.cloudinary.com/demo/image/fetch/'
    }
    // see: https://cloudinary.com/documentation/fetch_remote_images#remote_image_fetch_url
    const remoteUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'
    const generated = cloudinary.getImage(
      remoteUrl,
      {
        modifiers: {
          width: 300,
          height: 300
        },
        ...providerOptions
      }, emptyContext
    )
    expect(generated).toMatchObject({
      url: `https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto,w_300,h_300/${remoteUrl}`
    })
  })

  it('cloudinary upload', () => {
    const providerOptions = {
      baseURL: 'https://res.cloudinary.com/demo/image/upload/remote'
    }
    const generated = cloudinary.getImage(
      '/1/13/Benedict_Cumberbatch_2011.png',
      {
        modifiers: {
          width: 300,
          height: 300
        },
        ...providerOptions
      }, emptyContext
    )
    expect(generated).toMatchObject({
      url: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_300,h_300/remote/1/13/Benedict_Cumberbatch_2011.png'
    })
  })

  it('twicpics', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = twicpics.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.twicpics)
    }
  })

  it('glide', () => {
    const providerOptions = {
      baseURL: ''
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = glide.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.glide)
    }
  })

  it('fastly', () => {
    const providerOptions = {
      baseURL: ''
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = fastly.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.fastly)
    }
  })

  it('gumlet', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = gumlet.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.gumlet)
    }
  })

  it('imgix', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = imgix.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.imgix)
    }
  })

  it('imageengine', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = imageengine.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.imageengine)
    }
  })

  it('imageengine compression', () => {
    const providerOptions = {
      baseURL: 'https://foo.bar.com'
    }
    const generated = imageengine.getImage(
      '/test.jpg',
      {
        modifiers: {
          width: 150,
          quality: 0
        },
        ...providerOptions
      }, emptyContext
    )
    expect(generated).toMatchObject({
      url: 'https://foo.bar.com/test.jpg?imgeng=/w_150/cmpr_99'
    })
  })

  it('unsplash', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = unsplash.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.unsplash)
    }
  })

  it('imagekit', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = imagekit.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.imagekit)
    }
  })

  it('netlify', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = netlify.getImage(src, { modifiers: { ...modifiers }, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.netlify)
    }
  })

  it('prismic', () => {
    const providerOptions = {
      baseURL: '' // Use empty base URL for the sake of simplicity
    }

    const EXISTING_QUERY_PARAMETERS =
      '?auto=compress,format&rect=0,0,200,200&w=100&h=100'

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = prismic.getImage(`${src}${EXISTING_QUERY_PARAMETERS}`, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.prismic)
    }
  })

  it('sanity', () => {
    const providerOptions = {
      baseURL: '',
      projectId: 'projectid'
    }

    for (const image of images) {
      const [, modifiers] = image.args
      const generated = sanity.getImage('image-test-300x450-png', { modifiers: { ...modifiers }, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.sanity)
    }
  })

  it('contentful', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = contentful.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.contentful)
    }
  })

  it('cloudimage', () => {
    const providerOptions = {
      token: 'demo'
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = cloudimage.getImage(src, { modifiers, ...providerOptions }, emptyContext)
      expect(generated).toMatchObject(image.cloudimage)
    }
  })
})
