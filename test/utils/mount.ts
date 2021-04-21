import { mount } from '@vue/test-utils'
import { createImage } from '~image/image'

export function mountWithImg (Component: any, propsData: Record<string, any>) {
  const $img = createImage(
    {
      providers: {
        custom: {
          defaults: {},
          provider: {
            getImage (url) {
              return {
                url
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
