// @vitest-environment nuxt

import { beforeEach, describe, it, expect } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { NuxtPicture } from '#components'

describe('Renders simple image', () => {
  let wrapper: VueWrapper<any>
  const src = '/image.png'

  const observer = {
    wasAdded: false,
    wasDestroyed: false
  }

  beforeEach(() => {
    window.IntersectionObserver = class IntersectionObserver {
      root: any
      rootMargin: any
      thresholds: any
      takeRecords: any

      observe (_target: Element) {
        observer.wasAdded = true
      }

      disconnect () {
        observer.wasDestroyed = true
      }

      unobserve () {
        observer.wasDestroyed = true
      }
    }
    wrapper = mount(NuxtPicture, {
      propsData: {
        loading: 'lazy',
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
        src
      }
    })
  })

  it('Matches snapshot', () => {
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<picture>
        <source type=\\"image/webp\\" sizes=\\"(max-width: 500px) 500px, 900px\\" srcset=\\"/_ipx/f_webp&s_500x500/image.png 500w, /_ipx/f_webp&s_900x900/image.png 900w\\"><img width=\\"200\\" height=\\"200\\" data-nuxt-pic=\\"\\" src=\\"/_ipx/f_png&s_900x900/image.png\\" sizes=\\"(max-width: 500px) 500px, 900px\\" srcset=\\"/_ipx/f_png&s_500x500/image.png 500w, /_ipx/f_png&s_900x900/image.png 900w\\">
      </picture>"
    `)
  })

  it.todo('alt attribute is generated')

  it('props.src is picked up by getImage()', () => {
    [['source', 'srcset', '/_ipx/f_webp&s_500x500/image.png'], ['img', 'src']].forEach(([element, attribute, customSrc]) => {
      const domSrc = wrapper.find(element).element.getAttribute(attribute)
      expect(domSrc).toContain(customSrc || src)
    })
  })

  it('renders webp image source', () => {
    expect(wrapper.find('[type="image/webp"]').exists()).toBe(true)
  })

  it('props.src is reactive', async () => {
    const newSource = '/image.jpeg'
    wrapper.setProps({ src: newSource })

    await nextTick()

    ;[['source', 'srcset', '/_ipx/f_webp&s_500x500/image.jpeg'], ['img', 'src']].forEach(([element, attribute, src]) => {
      const domSrc = wrapper.find(element).element.getAttribute(attribute)
      expect(domSrc).toContain(src || newSource)
    })
  })

  it('sizes', () => {
    const sizes = wrapper.find('source').element.getAttribute('sizes')
    expect(sizes).toBe('(max-width: 500px) 500px, 900px')
  })
})
