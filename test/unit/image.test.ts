// @vitest-environment nuxt

import { beforeEach, describe, it, expect, vi } from 'vitest'
import { ComponentMountingOptions, VueWrapper, mount } from '@vue/test-utils'

import { NuxtImg } from '#components'

describe('Renders simple image', () => {
  let wrapper: VueWrapper<any>
  const src = '/image.png'

  beforeEach(() => {
    wrapper = mountImage({
      width: 200,
      height: 200,
      sizes: '200,500:500,900:900',
      src
    })
  })

  it('Matches snapshot', () => {
    expect(wrapper.html()).toMatchInlineSnapshot('"<img src=\\"/_ipx/s_1800x1800/image.png\\" width=\\"200\\" height=\\"200\\" data-nuxt-img=\\"\\" sizes=\\"(max-width: 500px) 500px, 900px\\" srcset=\\"/_ipx/s_500x500/image.png 500w, /_ipx/s_900x900/image.png 900w, /_ipx/s_1000x1000/image.png 1000w, /_ipx/s_1800x1800/image.png 1800w\\">"')
  })

  it('props.src is picked up by getImage()', () => {
    const domSrc = wrapper.element.getAttribute('src')
    expect(domSrc).toMatchInlineSnapshot('"/_ipx/s_1800x1800/image.png"')
  })

  it('props.src is reactive', async () => {
    const newSource = '/image.jpeg'
    wrapper.setProps({ src: newSource })
    await nextTick()

    const domSrc = wrapper.find('img').element.getAttribute('src')
    expect(domSrc).toMatchInlineSnapshot('"/_ipx/s_1800x1800/image.jpeg"')
  })

  it('sizes', () => {
    const sizes = wrapper.find('img').element.getAttribute('sizes')
    expect(sizes).toBe('(max-width: 500px) 500px, 900px')
  })

  it('applies densities', () => {
    const img = mountImage({
      width: 200,
      height: 300,
      sizes: '300:300px,400:400px',
      densities: '1x 2x 3x',
      src: 'image.png'
    })
    expect(img.html()).toMatchInlineSnapshot('"<img src=\\"/_ipx/s_1200x1800/image.png\\" width=\\"200\\" height=\\"300\\" data-nuxt-img=\\"\\" sizes=\\"(max-width: 300px) 300px, 400px\\" srcset=\\"/_ipx/s_300x450/image.png 300w, /_ipx/s_400x600/image.png 400w, /_ipx/s_600x900/image.png 600w, /_ipx/s_800x1200/image.png 800w, /_ipx/s_900x1350/image.png 900w, /_ipx/s_1200x1800/image.png 1200w\\">"')
  })

  it('encodes characters', () => {
    const img = mountImage({
      width: 200,
      height: 200,
      sizes: '200,500:500,900:900',
      src: '/汉字.png'
    })
    expect(img.html()).toMatchInlineSnapshot('"<img src=\\"/_ipx/s_1800x1800/%E6%B1%89%E5%AD%97.png\\" width=\\"200\\" height=\\"200\\" data-nuxt-img=\\"\\" sizes=\\"(max-width: 500px) 500px, 900px\\" srcset=\\"/_ipx/s_500x500/%E6%B1%89%E5%AD%97.png 500w, /_ipx/s_900x900/%E6%B1%89%E5%AD%97.png 900w, /_ipx/s_1000x1000/%E6%B1%89%E5%AD%97.png 1000w, /_ipx/s_1800x1800/%E6%B1%89%E5%AD%97.png 1800w\\">"')
  })

  it('correctly sets crop', () => {
    const img = mountImage({
      src: '/image.png',
      width: 1000,
      height: 2000,
      sizes: 'xs:100vw sm:100vw md:300px lg:350px xl:350px 2xl:350px'
    })
    expect(img.html()).toMatchInlineSnapshot('"<img src=\\"/_ipx/s_1280x2560/image.png\\" width=\\"1000\\" height=\\"2000\\" data-nuxt-img=\\"\\" sizes=\\"(max-width: 320px) 100vw, (max-width: 640px) 100vw, (max-width: 768px) 300px, (max-width: 1024px) 350px, (max-width: 1280px) 350px, 350px\\" srcset=\\"/_ipx/s_300x600/image.png 300w, /_ipx/s_320x640/image.png 320w, /_ipx/s_350x700/image.png 350w, /_ipx/s_600x1200/image.png 600w, /_ipx/s_640x1280/image.png 640w, /_ipx/s_700x1400/image.png 700w, /_ipx/s_1280x2560/image.png 1280w\\">"')
  })

  it('without sizes, but densities', () => {
    const img = mountImage({
      src: '/image.png',
      width: 300,
      height: 400,
      densities: '1x 2x 3x'
    })
    expect(img.html()).toMatchInlineSnapshot('"<img src=\\"/_ipx/s_300x400/image.png\\" width=\\"300\\" height=\\"400\\" data-nuxt-img=\\"\\" srcset=\\"/_ipx/s_300x400/image.png 1x, /_ipx/s_600x800/image.png 2x, /_ipx/s_900x1200/image.png 3x\\">"')
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

  it('props.placeholder with src', async () => {
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

  it('props.placeholder with sizes', async () => {
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

const mountImage = (props: ComponentMountingOptions<typeof NuxtImg>['props']) => mount(NuxtImg, { props })
