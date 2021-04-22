import { cleanDoubleSlashes } from '~/runtime/utils'
import * as ipx from '~/runtime/providers/ipx'
import * as cloudinary from '~/runtime/providers/cloudinary'
import * as twicpics from '~/runtime/providers/twicpics'
import * as fastly from '~/runtime/providers/fastly'
import * as imgix from '~/runtime/providers/imgix'
import * as imagekit from '~/runtime/providers/imagekit'

const images = [
  {
    args: ['/test.png', {}],
    ipx: { url: '/_ipx/test.png' },
    cloudinary: { url: '/f_auto,q_auto/test' },
    twicpics: { url: '/test.png' },
    fastly: { url: '/test.png' },
    imgix: { url: '/test.png' },
    imagekit: { url: '/test.png' }
  },
  {
    args: ['/test.png', { width: 200 }],
    ipx: { url: '/_ipx/test.png?w=200' },
    cloudinary: { url: '/f_auto,q_auto,w_200/test' },
    twicpics: { url: '/test.png?twic=v1/cover=200x-' },
    fastly: { url: '/test.png?width=200' },
    imgix: { url: '/test.png?w=200' },
    imagekit: { url: '/test.png?tr=w-200' }
  },
  {
    args: ['/test.png', { height: 200 }],
    ipx: { url: '/_ipx/test.png?h=200' },
    cloudinary: { url: '/f_auto,q_auto,h_200/test' },
    twicpics: { url: '/test.png?twic=v1/cover=-x200' },
    fastly: { url: '/test.png?height=200' },
    imgix: { url: '/test.png?h=200' },
    imagekit: { url: '/test.png?tr=h-200' }
  },
  {
    args: ['/test.png', { width: 200, height: 200 }],
    ipx: { url: '/_ipx/test.png?s=200_200' },
    cloudinary: { url: '/f_auto,q_auto,w_200,h_200/test' },
    twicpics: { url: '/test.png?twic=v1/cover=200x200' },
    fastly: { url: '/test.png?width=200&height=200' },
    imgix: { url: '/test.png?w=200&h=200' },
    imagekit: { url: '/test.png?tr=w-200,h-200' }
  },
  {
    args: ['/test.png', { width: 200, height: 200, fit: 'contain' }],
    ipx: { url: '/_ipx/test.png?fit=contain&s=200_200' },
    cloudinary: { url: '/f_auto,q_auto,w_200,h_200,c_scale/test' },
    twicpics: { url: '/test.png?twic=v1/contain=200x200' },
    fastly: { url: '/test.png?width=200&height=200&fit=bounds' },
    imgix: { url: '/test.png?w=200&h=200&fit=fill' },
    imagekit: { url: '/test.png?tr=w-200,h-200,cm-pad_resize' }
  },
  {
    args: ['/test.png', { width: 200, height: 200, fit: 'contain', format: 'jpeg' }],
    ipx: { url: '/_ipx/test.png?fit=contain&f=jpeg&s=200_200' },
    cloudinary: { url: '/f_jpeg,q_auto,w_200,h_200,c_scale/test' },
    twicpics: { url: '/test.png?twic=v1/output=jpeg/contain=200x200' },
    fastly: { url: '/test.png?width=200&height=200&fit=bounds&format=jpeg' },
    imgix: { url: '/test.png?w=200&h=200&fit=fill&fm=jpeg' },
    imagekit: { url: '/test.png?tr=w-200,h-200,cm-pad_resize,f-jpeg' }
  }
] as const

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
})
