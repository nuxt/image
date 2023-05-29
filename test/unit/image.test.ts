// @vitest-environment nuxt

import { beforeEach, describe, it, expect, vi } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'

import { NuxtImg } from '#components'


const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

describe('Renders simple image', () => {
  let wrapper: VueWrapper<any>
  const src = '/image.png'

  beforeEach(() => {
    wrapper = mount(NuxtImg, {
      propsData: {
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
        src
      }
    })
  })

  it('Matches snapshot', () => {
    expect(wrapper.html()).toMatchInlineSnapshot('"<img src=\\"/_ipx/s_900x900/image.png\\" width=\\"200\\" height=\\"200\\" data-nuxt-img=\\"\\" sizes=\\"(max-width: 500px) 500px, 900px\\" srcset=\\"/_ipx/s_500x500/image.png 500w, /_ipx/s_900x900/image.png 900w\\">"')
  })

  it('props.src is picked up by getImage()', () => {
    const domSrc = wrapper.element.getAttribute('src')
    expect(domSrc).toMatchInlineSnapshot('"/_ipx/s_900x900/image.png"')
  })

  it('props.src is reactive', async () => {
    const newSource = '/image.jpeg'
    wrapper.setProps({ src: newSource })
    await nextTick()

    const domSrc = wrapper.find('img').element.getAttribute('src')
    expect(domSrc).toMatchInlineSnapshot('"/_ipx/s_900x900/image.jpeg"')
  })

  it('sizes', () => {
    const sizes = wrapper.find('img').element.getAttribute('sizes')
    expect(sizes).toBe('(max-width: 500px) 500px, 900px')
  })
})

const getImageLoad = (cb = () => {}) => {
  let resolve = () => {}
  let image = {} as HTMLImageElement
  const loadEvent = Symbol('loadEvent')
  const ImageMock = vi.fn(() => {
    const _image = {
      onload: () => {}
    } as unknown as HTMLImageElement
    image = _image
    // @ts-ignore
    resolve = () => _image.onload?.(loadEvent)

    return _image
  })

  vi.stubGlobal('Image', ImageMock)
  cb()
  vi.unstubAllGlobals()

  return {
    resolve,
    image,
    loadEvent
  }
}

describe('Renders placeholded image', () => {
  let wrapper: VueWrapper<any>
  const src = '/image.png'

  it.only('props.placeholder with src', async () => {
    const {
      resolve: resolveImage,
      image: placeholderImage,
      loadEvent
    } = getImageLoad(() => {
      wrapper = mount(NuxtImg, {
        propsData: {
          width: 200,
          height: 200,
          src,
          placeholder: true
        }
      })
    })

    let domSrc = wrapper.find('img').element.getAttribute('src')

    expect(domSrc).toMatchInlineSnapshot('"/_ipx/q_50&s_10x10/image.png"')
    expect(placeholderImage.src).toMatchInlineSnapshot('"/_ipx/s_200x200/image.png"')

    resolveImage()
    await nextTick()

    domSrc = wrapper.find('img').element.getAttribute('src')

    expect(domSrc).toMatchInlineSnapshot('"/_ipx/s_200x200/image.png"')
    expect(wrapper.emitted().load[0]).toStrictEqual([loadEvent])
  })

  it.only('props.placeholder with sizes', async () => {
    const {
      resolve: resolveImage,
      image: placeholderImage,
      loadEvent
    } = getImageLoad(() => {
      wrapper = mount(NuxtImg, {
        propsData: {
          width: 200,
          height: 200,
          src,
          sizes: '200,500:500,900:900',
          placeholder: true
        }
      })
    })

    let sizes = wrapper.find('img').element.getAttribute('sizes')

    expect(sizes).toBe(null)
    expect(placeholderImage.sizes).toBe('(max-width: 500px) 500px, 900px')

    resolveImage()
    await nextTick()

    sizes = wrapper.find('img').element.getAttribute('sizes')

    expect(sizes).toBe('(max-width: 500px) 500px, 900px')
    expect(wrapper.emitted().load[0]).toStrictEqual([loadEvent])
  })
})
