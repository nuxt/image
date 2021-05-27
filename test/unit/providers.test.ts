import { images } from '../providers'

import { cleanDoubleSlashes } from '~/runtime/utils'
import * as ipx from '~/runtime/providers/ipx'
import * as cloudinary from '~/runtime/providers/cloudinary'
import * as twicpics from '~/runtime/providers/twicpics'
import * as fastly from '~/runtime/providers/fastly'
import * as imgix from '~/runtime/providers/imgix'
import * as imagekit from '~/runtime/providers/imagekit'
import * as prismic from '~/runtime/providers/prismic'

describe('Providers', () => {
  test('ipx', () => {
    const providerOptions = {}

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = ipx.getImage(src, { modifiers: { ...modifiers }, ...providerOptions }, {} as any)
      generated.url = cleanDoubleSlashes(generated.url)
      expect(generated).toMatchObject(image.ipx)
    }
  })

  test('cloudinary', () => {
    const providerOptions = {
      baseURL: '/'
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = cloudinary.getImage(src, { modifiers, ...providerOptions }, {} as any)
      expect(generated).toMatchObject(image.cloudinary)
    }
  })

  test('cloudinary fetch', () => {
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
      }, {} as any
    )
    expect(generated).toMatchObject({
      url: `https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto,w_300,h_300/${remoteUrl}`
    })
  })

  test('cloudinary upload', () => {
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
      }, {} as any
    )
    expect(generated).toMatchObject({
      url: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_300,h_300/remote/1/13/Benedict_Cumberbatch_2011.png'
    })
  })

  test('twicpics', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = twicpics.getImage(src, { modifiers, ...providerOptions }, {} as any)
      expect(generated).toMatchObject(image.twicpics)
    }
  })

  test('fastly', () => {
    const providerOptions = {
      baseURL: ''
    }
    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = fastly.getImage(src, { modifiers, ...providerOptions }, {} as any)
      expect(generated).toMatchObject(image.fastly)
    }
  })

  test('imgix', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = imgix.getImage(src, { modifiers, ...providerOptions }, {} as any)
      expect(generated).toMatchObject(image.imgix)
    }
  })

  test('imagekit', () => {
    const providerOptions = {
      baseURL: ''
    }

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = imagekit.getImage(src, { modifiers, ...providerOptions }, {} as any)
      expect(generated).toMatchObject(image.imagekit)
    }
  })

  test('prismic', () => {
    const providerOptions = {
      baseURL: '' // Use empty base URL for the sake of simplicity
    }

    const EXISTING_QUERY_PARAMETERS =
      '?auto=compress,format&rect=0,0,200,200&w=100&h=100'

    for (const image of images) {
      const [src, modifiers] = image.args
      const generated = prismic.getImage(`${src}${EXISTING_QUERY_PARAMETERS}`, { modifiers, ...providerOptions }, {} as any)
      expect(generated).toMatchObject(image.prismic)
    }
  })
})
