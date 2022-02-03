import { mount } from '@vue/test-utils'
import { CreateImageOptions } from '~/types'
import { createImage } from '~image/image'

export function getSrc (path: string) {
  return '/_custom' + path
}

export function mountWithImg (Component: any, propsData: Record<string, any>, strategy: CreateImageOptions['strategy'] = 'desktop-first') {
  const $img = createImage(
    {
      strategy,
      providers: {
        custom: {
          defaults: {},
          provider: {
            getImage (url, options) {
              const segments = url.split('.')
              const path = [segments.slice(0, -1), (options.modifiers?.format || segments.slice(-1))].join('.')
              return {
                url: getSrc(path)
              }
            }
          }
        }
      },
      presets: {},
      provider: 'custom'
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
