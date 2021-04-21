import { mount } from '@vue/test-utils'
import { createImage } from '~image/image'

export function mountWithImg (Component: any, propsData: Record<string, any>) {
  const $img = createImage(
    {
      providers: {
        custom: {
          defaults: {},
          provider: {
            getImage (url, options) {
              const segments = url.split('.')
              const path = [segments.slice(0, -1), (options.modifiers?.format || segments.slice(-1))].join('.')
              return {
                url: path
              }
            }
          }
        }
      },
      presets: {},
      provider: 'custom',
      intersectOptions: {}
    },
    {}
  )

  return mount(
    {
      inject: ['$img'],
      ...Component
    },
    {
      propsData,
      provide: {
        $img
      }
    }
  )
}
