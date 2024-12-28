// @vitest-environment nuxt

import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
// @ts-expect-error virtual file
import { imageOptions } from '#build/image-options'
import { NuxtImg } from '#components'
import { createImage } from '#image'

describe('Renders simple image', () => {
  let wrapper: VueWrapper<any>
  const src = '/image.png'

  beforeEach(() => {
    wrapper = mountImage({
      width: 200,
      height: 200,
      sizes: '200,500:500,900:900',
      src,
    })
  })

  it('Matches snapshot', () => {
    expect(wrapper.html()).toMatchInlineSnapshot(`"<img width="200" height="200" data-nuxt-img="" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/s_200x200/image.png 200w, /_ipx/s_400x400/image.png 400w, /_ipx/s_500x500/image.png 500w, /_ipx/s_900x900/image.png 900w, /_ipx/s_1000x1000/image.png 1000w, /_ipx/s_1800x1800/image.png 1800w" src="/_ipx/s_1800x1800/image.png">"`)
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
    expect(sizes).toMatchInlineSnapshot('"(max-width: 500px) 200px, (max-width: 900px) 500px, 900px"')
  })

  it('applies densities', () => {
    const img = mountImage({
      width: 200,
      height: 300,
      sizes: '300:300px,400:400px',
      densities: '1x 2x 3x',
      src: 'image.png',
    })
    expect(img.html()).toMatchInlineSnapshot(`"<img width="200" height="300" data-nuxt-img="" sizes="(max-width: 400px) 300px, 400px" srcset="/_ipx/s_300x450/image.png 300w, /_ipx/s_400x600/image.png 400w, /_ipx/s_600x900/image.png 600w, /_ipx/s_800x1200/image.png 800w, /_ipx/s_900x1350/image.png 900w, /_ipx/s_1200x1800/image.png 1200w" src="/_ipx/s_1200x1800/image.png">"`)
  })

  it('empty densities (fallback to global)', () => {
    const img = mountImage({
      width: 200,
      height: 300,
      sizes: '300:300px,400:400px',
      densities: '',
      src: 'image.png',
    })
    expect(img.html()).toMatchInlineSnapshot(`"<img width="200" height="300" data-nuxt-img="" sizes="(max-width: 400px) 300px, 400px" srcset="/_ipx/s_300x450/image.png 300w, /_ipx/s_400x600/image.png 400w, /_ipx/s_600x900/image.png 600w, /_ipx/s_800x1200/image.png 800w" src="/_ipx/s_800x1200/image.png">"`)
  })

  it('empty string densities (fallback to global)', () => {
    const img = mountImage({
      width: 200,
      height: 300,
      sizes: '300:300px,400:400px',
      densities: ' ',
      src: 'image.png',
    })
    expect(img.html()).toMatchInlineSnapshot(`"<img width="200" height="300" data-nuxt-img="" sizes="(max-width: 400px) 300px, 400px" srcset="/_ipx/s_300x450/image.png 300w, /_ipx/s_400x600/image.png 400w, /_ipx/s_600x900/image.png 600w, /_ipx/s_800x1200/image.png 800w" src="/_ipx/s_800x1200/image.png">"`)
  })

  it('error on invalid densities', () => {
    expect(() => mountImage({
      width: 200,
      height: 300,
      densities: 'x',
      src: 'image.png',
    })).toThrow(Error)
  })

  it('with single sizes entry', () => {
    const img = mountImage({
      src: '/image.png',
      width: 300,
      height: 400,
      sizes: '150',
    })
    expect(img.html()).toMatchInlineSnapshot(`"<img width="300" height="400" data-nuxt-img="" sizes="150px" srcset="/_ipx/s_150x200/image.png 150w, /_ipx/s_300x400/image.png 300w" src="/_ipx/s_300x400/image.png">"`)
  })

  it('with single sizes entry (responsive)', () => {
    const img = mountImage({
      src: '/image.png',
      width: 300,
      height: 400,
      sizes: 'sm:150',
    })
    expect(img.html()).toMatchInlineSnapshot(`"<img width="300" height="400" data-nuxt-img="" sizes="150px" srcset="/_ipx/s_150x200/image.png 150w, /_ipx/s_300x400/image.png 300w" src="/_ipx/s_300x400/image.png">"`)
  })

  it('de-duplicates sizes & srcset', () => {
    const img = mountImage({
      width: 200,
      height: 300,
      sizes: '200:200px,300:200px,400:400px,400:400px,500:500px,800:800px',
      src: 'image.png',
    })
    expect(img.html()).toMatchInlineSnapshot(`"<img width="200" height="300" data-nuxt-img="" sizes="(max-width: 300px) 200px, (max-width: 400px) 200px, (max-width: 500px) 400px, (max-width: 800px) 500px, 800px" srcset="/_ipx/s_200x300/image.png 200w, /_ipx/s_400x600/image.png 400w, /_ipx/s_500x750/image.png 500w, /_ipx/s_800x1200/image.png 800w, /_ipx/s_1000x1500/image.png 1000w, /_ipx/s_1600x2400/image.png 1600w" src="/_ipx/s_1600x2400/image.png">"`)
  })

  it('encodes characters', () => {
    const img = mountImage({
      width: 200,
      height: 200,
      sizes: '200,500:500,900:900',
      src: '/汉字.png',
    })
    expect(img.html()).toMatchInlineSnapshot(`"<img width="200" height="200" data-nuxt-img="" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/s_200x200/%E6%B1%89%E5%AD%97.png 200w, /_ipx/s_400x400/%E6%B1%89%E5%AD%97.png 400w, /_ipx/s_500x500/%E6%B1%89%E5%AD%97.png 500w, /_ipx/s_900x900/%E6%B1%89%E5%AD%97.png 900w, /_ipx/s_1000x1000/%E6%B1%89%E5%AD%97.png 1000w, /_ipx/s_1800x1800/%E6%B1%89%E5%AD%97.png 1800w" src="/_ipx/s_1800x1800/%E6%B1%89%E5%AD%97.png">"`)
  })

  it('correctly sets crop', () => {
    const img = mountImage({
      src: '/image.png',
      width: 1000,
      height: 2000,
      sizes: 'xs:100vw sm:100vw md:300px lg:350px xl:350px 2xl:350px',
    })
    expect(img.html()).toMatchInlineSnapshot(`"<img width="1000" height="2000" data-nuxt-img="" sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 300px, (max-width: 1280px) 350px, (max-width: 1536px) 350px, 350px" srcset="/_ipx/s_300x600/image.png 300w, /_ipx/s_320x640/image.png 320w, /_ipx/s_350x700/image.png 350w, /_ipx/s_600x1200/image.png 600w, /_ipx/s_640x1280/image.png 640w, /_ipx/s_700x1400/image.png 700w, /_ipx/s_1280x2560/image.png 1280w" src="/_ipx/s_1280x2560/image.png">"`)
  })

  it('without sizes, but densities', () => {
    const img = mountImage({
      src: '/image.png',
      width: 300,
      height: 400,
      densities: '1x 2x 3x',
    })
    expect(img.html()).toMatchInlineSnapshot(`"<img width="300" height="400" data-nuxt-img="" srcset="/_ipx/s_300x400/image.png 1x, /_ipx/s_600x800/image.png 2x, /_ipx/s_900x1200/image.png 3x" src="/_ipx/s_300x400/image.png">"`)
  })

  it('with nonce', () => {
    const img = mountImage({
      src: '/image.png',
      width: 300,
      height: 400,
      nonce: 'stub-nonce',
    })
    const domNonce = img.element.getAttribute('nonce')
    expect(domNonce).toBe('stub-nonce')
  })
})

const getImageLoad = (cb = () => {}) => {
  let resolve = () => {}
  let reject = () => {}
  let image = {} as HTMLImageElement
  const loadEvent = Symbol('loadEvent')
  const errorEvent = Symbol('errorEvent')
  const ImageMock = vi.fn(() => {
    const _image = {
      onload: () => {},
      onerror: () => {},
    } as unknown as HTMLImageElement
    image = _image
    // @ts-expect-error not valid argument for onload
    resolve = () => _image.onload?.(loadEvent)
    // @ts-expect-error not valid argument for onload
    reject = () => _image.onerror?.(errorEvent)

    return _image
  })

  vi.stubGlobal('Image', ImageMock)
  cb()
  vi.unstubAllGlobals()

  return {
    resolve,
    reject,
    image,
    loadEvent,
    errorEvent,
  }
}

describe('Renders placeholder image', () => {
  let wrapper: VueWrapper<any>
  const src = '/image.png'

  it('props.placeholder with src', async () => {
    const {
      resolve: resolveImage,
      image: placeholderImage,
      loadEvent,
    } = getImageLoad(() => {
      wrapper = mount(NuxtImg, {
        propsData: {
          width: 200,
          height: 200,
          src,
          placeholder: true,
        },
      })
    })

    let domSrc = wrapper.find('img').element.getAttribute('src')

    expect(domSrc).toMatchInlineSnapshot('"/_ipx/q_50&blur_3&s_10x10/image.png"')
    expect(placeholderImage.src).toMatchInlineSnapshot('"/_ipx/s_200x200/image.png"')

    resolveImage()
    await nextTick()

    domSrc = wrapper.find('img').element.getAttribute('src')

    expect(domSrc).toMatchInlineSnapshot('"/_ipx/s_200x200/image.png"')
    expect(wrapper.emitted().load![0]).toStrictEqual([loadEvent])
  })

  it('props.placeholder with sizes', async () => {
    const {
      resolve: resolveImage,
      image: placeholderImage,
      loadEvent,
    } = getImageLoad(() => {
      wrapper = mount(NuxtImg, {
        propsData: {
          width: 200,
          height: 200,
          src,
          sizes: '200,500:500,900:900',
          placeholder: true,
        },
      })
    })

    let sizes = wrapper.find('img').element.getAttribute('sizes')

    expect(sizes).toMatchInlineSnapshot('null')
    expect(placeholderImage.sizes).toMatchInlineSnapshot('"(max-width: 500px) 200px, (max-width: 900px) 500px, 900px"')

    resolveImage()
    await nextTick()

    sizes = wrapper.find('img').element.getAttribute('sizes')

    expect(sizes).toMatchInlineSnapshot('"(max-width: 500px) 200px, (max-width: 900px) 500px, 900px"')
    expect(wrapper.emitted().load![0]).toStrictEqual([loadEvent])
  })

  it('placeholder class can be set', async () => {
    const { resolve: resolveImage } = getImageLoad(() => {
      wrapper = mount(NuxtImg, {
        propsData: {
          src,
          placeholder: true,
          placeholderClass: 'placeholder',
        },
        attrs: {
          class: [{ test: true }, 'other'],
        },
      })
    })
    expect([...wrapper.element.classList]).toMatchInlineSnapshot(`
      [
        "placeholder",
        "test",
        "other",
      ]
    `)
    expect(wrapper.element.getAttribute('src')).toMatchInlineSnapshot('"/_ipx/q_50&blur_3&s_10x10/image.png"')
    resolveImage()
    await nextTick()
    expect([...wrapper.element.classList]).toMatchInlineSnapshot(`
      [
        "test",
        "other",
      ]
    `)
    expect(wrapper.element.getAttribute('src')).toMatchInlineSnapshot(`"/_ipx/_/image.png"`)
  })

  it('props.placeholder with source loaded error event triggers', async () => {
    const {
      reject: rejectImage,
      errorEvent,
    } = getImageLoad(() => {
      wrapper = mount(NuxtImg, {
        propsData: {
          width: 200,
          height: 200,
          src,
          placeholder: true,
        },
      })
    })
    rejectImage()
    await nextTick()

    expect(wrapper.emitted().error![0]).toStrictEqual([errorEvent])
  })
})

describe('Renders image, applies module config', () => {
  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()
  const src = '/image.png'

  beforeEach(() => {
    delete nuxtApp._img
  })

  it('Module config .quality applies', () => {
    nuxtApp._img = createImage({
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
      },
      quality: 75,
    })
    const img = mount(NuxtImg, {
      propsData: {
        src,
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
      },
    })
    expect(img.html()).toMatchInlineSnapshot(`"<img width="200" height="200" data-nuxt-img="" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/q_75&amp;s_200x200/image.png 200w, /_ipx/q_75&amp;s_400x400/image.png 400w, /_ipx/q_75&amp;s_500x500/image.png 500w, /_ipx/q_75&amp;s_900x900/image.png 900w, /_ipx/q_75&amp;s_1000x1000/image.png 1000w, /_ipx/q_75&amp;s_1800x1800/image.png 1800w" src="/_ipx/q_75&amp;s_1800x1800/image.png">"`)
  })

  it('Module config .quality + props.quality => props.quality applies', () => {
    nuxtApp._img = createImage({
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
      },
      quality: 75,
    })
    const img = mount(NuxtImg, {
      propsData: {
        src,
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
        quality: 90,
      },
    })
    expect(img.html()).toMatchInlineSnapshot(`"<img width="200" height="200" data-nuxt-img="" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/q_90&amp;s_200x200/image.png 200w, /_ipx/q_90&amp;s_400x400/image.png 400w, /_ipx/q_90&amp;s_500x500/image.png 500w, /_ipx/q_90&amp;s_900x900/image.png 900w, /_ipx/q_90&amp;s_1000x1000/image.png 1000w, /_ipx/q_90&amp;s_1800x1800/image.png 1800w" src="/_ipx/q_90&amp;s_1800x1800/image.png">"`)
  })

  it('Without quality config => default image', () => {
    nuxtApp._img = createImage({
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
      },
    })
    const img = mount(NuxtImg, {
      propsData: {
        src,
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
      },
    })
    expect(img.html()).toMatchInlineSnapshot(`"<img width="200" height="200" data-nuxt-img="" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/s_200x200/image.png 200w, /_ipx/s_400x400/image.png 400w, /_ipx/s_500x500/image.png 500w, /_ipx/s_900x900/image.png 900w, /_ipx/s_1000x1000/image.png 1000w, /_ipx/s_1800x1800/image.png 1800w" src="/_ipx/s_1800x1800/image.png">"`)
  })
})

describe('Renders NuxtImg with the custom prop and default slot', () => {
  let wrapper: VueWrapper<any>
  const src = '/image.png'

  it('renders custom placeholder when image is not loaded', async () => {
    const {
      resolve: resolveImage,
      loadEvent,
    } = getImageLoad(() => {
      wrapper = mount(NuxtImg, {
        propsData: {
          'width': 200,
          'height': 200,
          'src': src,
          'custom': true,
        },
        slots: {
          default: ({ imgAttrs, src, isLoaded }: { imgAttrs: any, src: string, isLoaded: boolean }) => {
            const img = h('img', { ...imgAttrs, src })
            const placeholder = h('p', {}, 'placeholder')

            return isLoaded
              ? img
              : placeholder
          },
        },
      })
    })

    const placeholderText = wrapper.find('p').element.getHTML()
    let img = wrapper.find('img')

    expect(placeholderText).toMatchInlineSnapshot('"placeholder"')
    expect(img.exists()).toBeFalsy()

    resolveImage()
    await nextTick()

    img = wrapper.find('img')
    const domSrc = img.element.getAttribute('src')

    expect(img.element.getAttribute('width')).toBe('200')
    expect(img.element.getAttribute('height')).toBe('200')
    expect(domSrc).toMatchInlineSnapshot('"/_ipx/s_200x200/image.png"')
    expect(wrapper.emitted().load![0]).toStrictEqual([loadEvent])
  })
})

const mountImage = (props: ComponentMountingOptions<typeof NuxtImg>['props']) => mount(NuxtImg, { props })
