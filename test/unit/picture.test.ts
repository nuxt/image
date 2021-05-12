/**
 * @jest-environment jsdom
 */

import type Vue from 'vue'
import { Wrapper } from '@vue/test-utils'

import { getSrc, mountWithImg } from './utils/mount'
import { nextTick } from './utils/tick'

import NuxtPicture from '~/runtime/components/nuxt-picture.vue'

describe('Renders simple image', () => {
  let wrapper: Wrapper<Vue>
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
    wrapper = mountWithImg(NuxtPicture, {
      loading: 'lazy',
      width: 200,
      height: 200,
      sizes: '200,500:500,900:900',
      src
    })
  })

  test('Matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  test.todo('alt attribute is generated')

  test('props.src is picked up by getImage()', () => {
    ;[['source', 'srcset', '/image.webp'], ['img', 'src']].forEach(([element, attribute, customSrc]) => {
      const domSrc = wrapper.find(element).element.getAttribute(attribute)
      expect(domSrc).toContain(getSrc(customSrc || src))
    })
  })

  test('renders webp image source', () => {
    expect(wrapper.find('[type="image/webp"]').exists()).toBe(true)
  })

  test('props.src is reactive', async () => {
    const newSource = '/image.jpeg'
    wrapper.setProps({ src: newSource })

    await nextTick()

    ;[['source', 'srcset', '/image.webp'], ['img', 'src']].forEach(([element, attribute, src]) => {
      const domSrc = wrapper.find(element).element.getAttribute(attribute)
      expect(domSrc).toContain(getSrc(src || newSource))
    })
  })

  test('sizes', () => {
    const sizes = wrapper.find('source').element.getAttribute('sizes')
    expect(sizes).toBe('(max-width: 500px) 500px, 900px')
  })
})
