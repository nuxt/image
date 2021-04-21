import { setupTest, getContext } from '@nuxt/test-utils'

import type { $Img } from '~/index'

describe('Plugin', () => {
  let testContext, plugin
  const nuxtContext = {
    nuxtState: {
      data: [{}]
    },
    $img: null as null | $Img
  }

  setupTest({
    server: true,
    config: {
      image: {
        presets: {
          circle: {
            modifiers: {
              r: '100'
            }
          }
        },
        providers: {
          random: {
            name: 'random',
            provider: '~/providers/random'
          }
        },
        cloudinary: {
          baseURL: 'https://res.cloudinary.com/nuxt/image/upload'
        }
      }
    }
  })

  test('Setup local test context', async () => {
    testContext = getContext()
    plugin = (await import(testContext.nuxt!.options.buildDir + '/image.js')).default
    // @ts-ignore
    plugin(nuxtContext, (_, data) => { nuxtContext.$img = data })
  })

  test.skip('Generate placeholder', async () => {
    // TODO: see https://github.com/nuxt/image/issues/189)
    // const placeholder = nuxtContext.$img?.getPlaceholder('/test.png')
    // expect(placeholder).toEqual('/_image/local/_/w_30/test.png')
  })

  test('Generate Random Image', () => {
    const { url } = nuxtContext.$img?.getImage('/test.png', { provider: 'random' })!
    expect(url).toEqual('https://source.unsplash.com/random/600x400')
  })

  test('Generate Circle Image with Cloudinary', () => {
    const { url } = nuxtContext.$img?.getImage('/test.png', { provider: 'cloudinary', preset: 'circle' })!
    expect(url).toEqual('https://res.cloudinary.com/nuxt/image/upload/f_auto,q_auto,r_100/test')
  })

  test('Deny undefined provider', () => {
    expect(() => nuxtContext.$img?.getImage('/test.png', { provider: 'invalid' })).toThrow(Error)
  })

  test('Deny undefined preset', () => {
    expect(() => nuxtContext.$img?.getImage('/test.png', { preset: 'invalid' })).toThrow(Error)
  })
})
