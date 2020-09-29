import fs from 'fs-extra'
import local from '../src/providers/local'
import cloudinary from '../src/providers/cloudinary'
import twicpics from '../src/providers/twicpics'

const images = [
  {
    args: ['/test.png', {}],
    local: { isStatic: true, url: '/_image/local/_/_/test.png' },
    cloudinary: { url: '/c_fit/test.png' },
    twicpics: { url: '/test.png?twic=v1/' }
  },
  {
    args: ['/test.png', { width: 200 }],
    local: { isStatic: true, url: '/_image/local/_/w_200/test.png' },
    cloudinary: { url: '/w_200,c_fit/test.png' },
    twicpics: { url: '/test.png?twic=v1/cover=200x-' }
  },
  {
    args: ['/test.png', { height: 200 }],
    local: { isStatic: true, url: '/_image/local/_/h_200/test.png' },
    cloudinary: { url: '/h_200,c_fit/test.png' },
    twicpics: { url: '/test.png?twic=v1/cover=-x200' }
  },
  {
    args: ['/test.png', { width: 200, height: 200 }],
    local: { isStatic: true, url: '/_image/local/_/s_200_200/test.png' },
    cloudinary: { url: '/w_200,h_200,c_fit/test.png' },
    twicpics: { url: '/test.png?twic=v1/cover=200x200' }
  },
  {
    args: ['/test.png', { width: 200, height: 200, size: 'contain' }],
    local: { isStatic: true, url: '/_image/local/_/s_200_200_contain/test.png' },
    cloudinary: { url: '/w_200,h_200,c_scale/test.png' },
    twicpics: { url: '/test.png?twic=v1/contain=200x200' }
  },
  {
    args: ['/test.png', { width: 200, height: 200, size: 'contain', format: 'jpeg' }],
    local: { isStatic: true, url: '/_image/local/jpeg/s_200_200_contain/test.png' },
    cloudinary: { url: '/w_200,h_200,f_jpeg,c_scale/test.png' },
    twicpics: { url: '/test.png?twic=v1/contain=200x200/format=jpeg' }
  }
]

describe('Providers', () => {
  test('local', async () => {
    const providerOptions = {}
    const providerDataExpectedkeys = ['runtime', 'runtimeOptions', 'middleware']
    const providerData = local(providerOptions)

    expect(Object.keys(providerData)).toEqual(expect.arrayContaining(providerDataExpectedkeys))
    // middleware
    expect(typeof providerData.middleware).toEqual('function')
    expect(providerData.middleware.length).toEqual(2)

    const isRuntimeExists = await fs.exists(providerData.runtime)
    expect(isRuntimeExists).toEqual(true)

    const runtime = (await import(providerData.runtime)).default
    expect(typeof runtime).toEqual('object')
    expect(typeof runtime.generateURL).toEqual('function')

    for (const image of images) {
      const generated = runtime.generateURL.call(null, ...image.args, providerData.runtimeOptions)
      expect(generated).toEqual(image.local)
    }
  })

  test('cloudinary', async () => {
    const providerOptions = {
      baseURL: '/'
    }
    const providerDataExpectedkeys = ['runtime', 'runtimeOptions']
    const providerData = cloudinary(providerOptions)

    expect(Object.keys(providerData)).toEqual(expect.arrayContaining(providerDataExpectedkeys))

    const isRuntimeExists = await fs.exists(providerData.runtime)
    expect(isRuntimeExists).toEqual(true)

    const runtime = (await import(providerData.runtime)).default
    expect(typeof runtime).toEqual('object')
    expect(typeof runtime.generateURL).toEqual('function')

    for (const image of images) {
      const generated = runtime.generateURL.call(null, ...image.args, providerData.runtimeOptions)
      expect(generated).toEqual(image.cloudinary)
    }
  })

  test('twicpics', async () => {
    const providerOptions = {
      baseURL: ''
    }
    const providerDataExpectedkeys = ['runtime', 'runtimeOptions']
    const providerData = twicpics(providerOptions)

    expect(Object.keys(providerData)).toEqual(expect.arrayContaining(providerDataExpectedkeys))

    const isRuntimeExists = await fs.exists(providerData.runtime)
    expect(isRuntimeExists).toEqual(true)

    const runtime = (await import(providerData.runtime)).default
    expect(typeof runtime).toEqual('object')
    expect(typeof runtime.generateURL).toEqual('function')

    for (const image of images) {
      const generated = runtime.generateURL.call(null, ...image.args, providerData.runtimeOptions)
      expect(generated).toEqual(image.twicpics)
    }
  })
})
