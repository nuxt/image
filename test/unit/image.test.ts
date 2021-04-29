/**
 * @jest-environment jsdom
 */

import type Vue from 'vue'
import { Wrapper } from '@vue/test-utils'

import { getSrc, mountWithImg } from './utils/mount'
import { mockObserver } from './utils/observer'
import { nextTick } from './utils/tick'

import NuxtImg from '~/runtime/components/nuxt-img.vue'

describe('Renders simple image', () => {
  let wrapper: Wrapper<Vue>
  const src = '/image.png'

  beforeEach(() => {
    wrapper = mountWithImg(NuxtImg, {
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
  // () => {
  //   expect((wrapper.vm as any).generatedAlt).toEqual('image')
  //   const domAlt = wrapper.element.getAttribute('alt')
  //   expect(domAlt).toEqual('image')
  // }

  test('props.src is picked up by getImage()', () => {
    const domSrc = wrapper.element.getAttribute('src')
    expect(domSrc).toEqual(getSrc(src))
  })

  test('props.src is reactive', (done) => {
    const newSource = '/image.jpeg'
    wrapper.setProps({ src: newSource })
    process.nextTick(() => {
      const domSrc = wrapper.find('img').element.getAttribute('src')
      expect(domSrc).toEqual(getSrc(newSource))
      return done()
    })
  })

  test('sizes', () => {
    const sizes = wrapper.find('img').element.getAttribute('sizes')
    expect(sizes).toBe('(max-width: 500px) 500px, 900px')
  })
})
