import { setupTest, getContext } from '@nuxt/test-utils'

describe('Plugin', () => {
  let testContext, plugin
  const nuxtContext = {
    nuxtState: {
      data: [{}]
    },
    $img: null
  }

  setupTest({
    fixture: 'fixture/base',
    configFile: 'nuxt.config.ts',
    server: true,
    config: {
      image: {
        presets: [
          {
            name: 'circle',
            modifiers: {
              r: '100'
            }
          }
        ],
        providers: {
          random: '~/providers/random',
          cloudinary: {
            baseURL: 'https://res.cloudinary.com/nuxt/image/upload'
          }
        }
      }
    }
  })

  test('Generate Placeholder', async () => {
    testContext = getContext()
    plugin = (await import(testContext.nuxt.options.buildDir + '/image.js')).default
    plugin(nuxtContext, (_, data) => { nuxtContext.$img = data })

    // temporally commented
    // const placeholder = nuxtContext.$img.getPlaceholder('/test.png')
    // expect(placeholder).toEqual('/_image/local/_/w_30/test.png')
  })

  test.skip('Generate Random Image', () => {
    const image = nuxtContext.$img('/test.png', { provider: 'random' })
    expect(image).toEqual('https://source.unsplash.com/random/600x400')
  })

  test.skip('Generate Circle Image with Cloudinary', () => {
    const image = nuxtContext.$img('/test.png', { provider: 'cloudinary', preset: 'circle' })
    expect(image).toEqual('https://res.cloudinary.com/nuxt/image/upload/f_auto,q_auto,r_100/test')
  })

  test('Deny undefined provider', () => {
    expect(() => nuxtContext.$img('/test.png', { provider: 'invalid' })).toThrow(Error)
  })

  test('Deny undefined preset', () => {
    expect(() => nuxtContext.$img('/test.png', { preset: 'invalid' })).toThrow(Error)
  })
})
