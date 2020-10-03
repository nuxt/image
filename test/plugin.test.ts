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
          local: {},
          random: '~/providers/random',
          cloudinary: {
            baseURL: 'https://res.cloudinary.com/nuxt/image/upload'
          }
        }
      }
    }
  })

  test('Generate LQIP', async () => {
    testContext = getContext()
    plugin = (await import(testContext.nuxt.options.buildDir + '/image.js')).default
    plugin(nuxtContext, (_, data) => { nuxtContext.$img = data })

    const lqip = nuxtContext.$img.lqip('/test.png')
    expect(lqip).toEqual('/_image/local/_/w_30/test.png')
  })

  test('Generate Random Image', () => {
    const image = nuxtContext.$img('random:/test.png')
    expect(image).toEqual('https://source.unsplash.com/random/600x400')
  })

  test('Generate Circle Image with Cloudinary', () => {
    const image = nuxtContext.$img('cloudinary+circle:/test.png', {})
    expect(image).toEqual('https://res.cloudinary.com/nuxt/image/upload/r_100/test.png')
  })

  test('Deny Invalid Images', () => {
    expect(() => nuxtContext.$img('test.png', {})).toThrow(Error)
  })

  test('Deny undefined provider', () => {
    expect(() => nuxtContext.$img('invalid:/test.png', {})).toThrow(Error)
  })

  test('Deny undefined preset', () => {
    expect(() => nuxtContext.$img('+invalid:/test.png', {})).toThrow(Error)
  })
})
