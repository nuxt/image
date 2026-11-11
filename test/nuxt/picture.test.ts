import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NuxtPicture } from '#components'
import { createError, useNuxtApp, useRuntimeConfig, nextTick } from '#imports'
import { imageOptions } from '#build/image-options.mjs'
import { createImage } from '@nuxt/image/runtime'
import type { RuntimeConfig } from 'nuxt/schema'
import type { PlaceholderProp } from '../../src/runtime/utils/props'

describe('Renders simple image', () => {
  let wrapper: VueWrapper<any>
  const src = '/image.png'

  const observer = {
    wasAdded: false,
    wasDestroyed: false,
  }

  beforeEach(() => {
    window.IntersectionObserver = class IntersectionObserver {
      root: any
      rootMargin: any
      scrollMargin: any
      thresholds: any
      takeRecords: any

      observe(_target: Element) {
        observer.wasAdded = true
      }

      disconnect() {
        observer.wasDestroyed = true
      }

      unobserve() {
        observer.wasDestroyed = true
      }
    }
    wrapper = mount(NuxtPicture, {
      propsData: {
        loading: 'lazy',
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
        src,
      },
    })
  })

  it('Matches snapshot', () => {
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<picture>
        <source type="image/webp" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_webp&amp;s_200x200/image.png 200w, /_ipx/f_webp&amp;s_400x400/image.png 400w, /_ipx/f_webp&amp;s_500x500/image.png 500w, /_ipx/f_webp&amp;s_900x900/image.png 900w, /_ipx/f_webp&amp;s_1000x1000/image.png 1000w, /_ipx/f_webp&amp;s_1800x1800/image.png 1800w"><img width="200" height="200" data-nuxt-pic="" loading="lazy" src="/_ipx/f_png&amp;s_1800x1800/image.png" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_png&amp;s_200x200/image.png 200w, /_ipx/f_png&amp;s_400x400/image.png 400w, /_ipx/f_png&amp;s_500x500/image.png 500w, /_ipx/f_png&amp;s_900x900/image.png 900w, /_ipx/f_png&amp;s_1000x1000/image.png 1000w, /_ipx/f_png&amp;s_1800x1800/image.png 1800w">
      </picture>"
    `)
  })

  it.todo('alt attribute is generated')

  it('renders screens as sizes', () => {
    const img = mount(NuxtPicture, {
      propsData: {
        width: 200,
        height: 200,
        src,
      },
    })
    expect(img.html()).toMatchInlineSnapshot(`
      "<picture>
        <source type="image/webp" sizes="(max-width: 767px) 640px, (max-width: 1023px) 768px, (max-width: 1279px) 1024px, (max-width: 1535px) 1280px, 1536px" srcset="/_ipx/f_webp&amp;s_640x640/image.png 640w, /_ipx/f_webp&amp;s_768x768/image.png 768w, /_ipx/f_webp&amp;s_1024x1024/image.png 1024w, /_ipx/f_webp&amp;s_1280x1280/image.png 1280w, /_ipx/f_webp&amp;s_1536x1536/image.png 1536w, /_ipx/f_webp&amp;s_2048x2048/image.png 2048w, /_ipx/f_webp&amp;s_2560x2560/image.png 2560w, /_ipx/f_webp&amp;s_3072x3072/image.png 3072w"><img width="200" height="200" data-nuxt-pic="" src="/_ipx/f_png&amp;s_3072x3072/image.png" sizes="(max-width: 767px) 640px, (max-width: 1023px) 768px, (max-width: 1279px) 1024px, (max-width: 1535px) 1280px, 1536px" srcset="/_ipx/f_png&amp;s_640x640/image.png 640w, /_ipx/f_png&amp;s_768x768/image.png 768w, /_ipx/f_png&amp;s_1024x1024/image.png 1024w, /_ipx/f_png&amp;s_1280x1280/image.png 1280w, /_ipx/f_png&amp;s_1536x1536/image.png 1536w, /_ipx/f_png&amp;s_2048x2048/image.png 2048w, /_ipx/f_png&amp;s_2560x2560/image.png 2560w, /_ipx/f_png&amp;s_3072x3072/image.png 3072w">
      </picture>"
    `)
  })

  it('props.src is picked up by getImage()', () => {
    [['source', 'srcset', '/_ipx/f_webp&s_500x500/image.png'], ['img', 'src']].forEach(([element, attribute, customSrc]) => {
      const domSrc = wrapper.find(element!).element.getAttribute(attribute!)
      expect(domSrc).toContain(customSrc || src)
    })
  })

  it('renders webp image source', () => {
    expect(wrapper.find('[type="image/webp"]').exists()).toBe(true)
  })

  it('renders single format and fallback image tag', () => {
    const img = mount(NuxtPicture, {
      propsData: {
        width: 200,
        height: 200,
        format: 'avif',
        src,
      },
    })
    expect(img.find('source[type="image/avif"]').exists()).toBe(true)
    expect(img.find('img').exists()).toBe(true)
  })

  it('renders avif, webp and fallback image tag', () => {
    const img = mount(NuxtPicture, {
      propsData: {
        width: 200,
        height: 200,
        format: 'avif,webp',
        src,
      },
    })
    expect(img.find('source[type="image/avif"]').exists()).toBe(true)
    expect(img.find('source[type="image/webp"]').exists()).toBe(true)
    expect(img.find('img').exists()).toBe(true)
  })

  it('renders avif, gif and fallback image tag', () => {
    const img = mount(NuxtPicture, {
      propsData: {
        width: 200,
        height: 200,
        format: 'avif,gif',
        src,
      },
    })
    expect(img.find('source[type="image/avif"]').exists()).toBe(true)
    expect(img.find('source[type="image/gif"]').exists()).toBe(true)
    expect(img.find('img').exists()).toBe(true)
  })

  it('props.src is reactive', async () => {
    const newSource = '/image.jpeg'
    wrapper.setProps({ src: newSource })

    await nextTick()

    ;[['source', 'srcset', '/_ipx/f_webp&s_500x500/image.jpeg'], ['img', 'src']].forEach(([element, attribute, src]) => {
      const domSrc = wrapper.find(element!).element.getAttribute(attribute!)
      expect(domSrc).toContain(src || newSource)
    })
  })

  it('sizes', () => {
    const sizes = wrapper.find('source').element.getAttribute('sizes')
    expect(sizes).toMatchInlineSnapshot(`"(max-width: 499px) 200px, (max-width: 899px) 500px, 900px"`)
  })

  it('renders src when svg is passed', () => {
    const wrapper = mount(NuxtPicture, {
      propsData: {
        src: '/image.svg',
      },
    })
    expect(wrapper.html()).toMatchInlineSnapshot('"<picture><img data-nuxt-pic="" src="/image.svg"></picture>"')
  })

  it('encodes characters', () => {
    const img = mount(NuxtPicture, {
      propsData: {
        loading: 'lazy',
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
        src: '/汉字.png',
      },
    })
    expect(img.html()).toMatchInlineSnapshot(`
      "<picture>
        <source type="image/webp" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_webp&amp;s_200x200/%E6%B1%89%E5%AD%97.png 200w, /_ipx/f_webp&amp;s_400x400/%E6%B1%89%E5%AD%97.png 400w, /_ipx/f_webp&amp;s_500x500/%E6%B1%89%E5%AD%97.png 500w, /_ipx/f_webp&amp;s_900x900/%E6%B1%89%E5%AD%97.png 900w, /_ipx/f_webp&amp;s_1000x1000/%E6%B1%89%E5%AD%97.png 1000w, /_ipx/f_webp&amp;s_1800x1800/%E6%B1%89%E5%AD%97.png 1800w"><img width="200" height="200" data-nuxt-pic="" loading="lazy" src="/_ipx/f_png&amp;s_1800x1800/%E6%B1%89%E5%AD%97.png" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_png&amp;s_200x200/%E6%B1%89%E5%AD%97.png 200w, /_ipx/f_png&amp;s_400x400/%E6%B1%89%E5%AD%97.png 400w, /_ipx/f_png&amp;s_500x500/%E6%B1%89%E5%AD%97.png 500w, /_ipx/f_png&amp;s_900x900/%E6%B1%89%E5%AD%97.png 900w, /_ipx/f_png&amp;s_1000x1000/%E6%B1%89%E5%AD%97.png 1000w, /_ipx/f_png&amp;s_1800x1800/%E6%B1%89%E5%AD%97.png 1800w">
      </picture>"
    `)
  })

  it('renders <img> with custom format', () => {
    const img = mount(NuxtPicture, {
      propsData: {
        format: 'avif',
        src: '/test.png',
      },
    })
    expect(img.find('img').exists()).toBe(true)
  })
})

describe('Renders placeholder image', () => {
  const src = '/image.png'

  // Captures the off-screen elements used to load the real image
  const captureOffscreenImage = () => {
    const created: Record<string, HTMLElement[]> = {}
    const createElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation(((tag: string, options?: ElementCreationOptions) => {
      const el = createElement(tag, options)
      ;(created[tag] ||= []).push(el)
      return el
    }) as typeof document.createElement)
    // pictures rendered by the component contain an `<img data-nuxt-pic>`
    const offscreenPictures = () => (created.picture || []).filter(picture => !picture.querySelector('[data-nuxt-pic]'))
    return {
      offscreenPictures,
      offscreenImage: () => offscreenPictures()[0]!.querySelector('img') as HTMLImageElement,
    }
  }

  // The swap happens after the (async) decode of the loaded image
  const finishLoad = async (img: HTMLImageElement) => {
    img.onload!(new Event('load'))
    await new Promise(resolve => setTimeout(resolve))
    await nextTick()
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders only a placeholder <img> until the image is loaded', async () => {
    const created = captureOffscreenImage()
    const wrapper = mount(NuxtPicture, {
      propsData: { width: 200, height: 200, src, placeholder: true },
    })

    expect(wrapper.find('source').exists()).toBe(false)
    const img = wrapper.find('img').element
    expect(img.getAttribute('src')).toMatchInlineSnapshot(`"/_ipx/f_png&q_50&blur_3&s_10x10/image.png"`)
    expect(img.hasAttribute('srcset')).toBe(false)
    expect(img.hasAttribute('sizes')).toBe(false)

    // the real image is loaded off-screen with the same candidates
    const offscreen = created.offscreenImage()
    const offscreenSources = [...offscreen.parentElement!.querySelectorAll('source')]
    expect(offscreenSources).toHaveLength(1)
    expect(offscreenSources[0]!.type).toBe('image/webp')
    expect(offscreenSources[0]!.getAttribute('srcset')).toContain('/_ipx/f_webp&s_640x640/image.png 640w')
    expect(offscreen.parentElement?.tagName).toBe('PICTURE')
    expect(offscreen.getAttribute('src')).toBe('/_ipx/f_png&s_3072x3072/image.png')

    await finishLoad(offscreen)

    expect(wrapper.findAll('source')).toHaveLength(1)
    expect(wrapper.find('img').element.getAttribute('src')).toBe('/_ipx/f_png&s_3072x3072/image.png')
    expect(wrapper.find('img').element.getAttribute('srcset')).toContain('/_ipx/f_png&s_640x640/image.png 640w')
    expect(wrapper.emitted().load).toHaveLength(1)
  })

  it('keeps the same <img> element when swapping to the real image', async () => {
    const created = captureOffscreenImage()
    const wrapper = mount(NuxtPicture, {
      propsData: { src, placeholder: true },
    })
    const before = wrapper.find('img').element
    await finishLoad(created.offscreenImage())
    expect(wrapper.find('img').element).toBe(before)
  })

  it('supports the same placeholder values as <NuxtImg>', () => {
    const render = (placeholder: PlaceholderProp) => mount(NuxtPicture, {
      propsData: { src, placeholder },
    }).find('img').element.getAttribute('src')

    expect(render([50, 25])).toBe('/_ipx/f_png&q_50&blur_3&s_50x25/image.png')
    expect(render([50, 25, 75, 5])).toBe('/_ipx/f_png&q_75&blur_5&s_50x25/image.png')
    expect(render(15)).toBe('/_ipx/f_png&q_50&blur_3&s_15x15/image.png')
    expect(render('/placeholder.png')).toBe('/placeholder.png')
    expect(render('')).toBe('/_ipx/f_png&q_50&blur_3&s_10x10/image.png')
  })

  it('uses the legacy format for the generated placeholder', () => {
    const wrapper = mount(NuxtPicture, {
      propsData: { src, placeholder: true, format: 'avif,webp', legacyFormat: 'jpeg' },
    })
    expect(wrapper.find('img').element.getAttribute('src')).toBe('/_ipx/f_jpeg&q_50&blur_3&s_10x10/image.png')
  })

  it('applies placeholderClass only while the placeholder is shown', async () => {
    const created = captureOffscreenImage()
    const wrapper = mount(NuxtPicture, {
      propsData: { src, placeholder: true, placeholderClass: 'placeholder' },
      attrs: { class: 'picture' },
    })
    expect(wrapper.find('img').classes()).toEqual(['placeholder'])
    await finishLoad(created.offscreenImage())
    expect(wrapper.find('img').classes()).toEqual([])
  })

  it('emits error and keeps the placeholder when the image fails to load', async () => {
    const created = captureOffscreenImage()
    const wrapper = mount(NuxtPicture, {
      propsData: { src, placeholder: true },
    })
    const errorEvent = new Event('error')
    ;(created.offscreenImage()).onerror!(errorEvent)
    await nextTick()

    expect(wrapper.emitted().error![0]).toStrictEqual([errorEvent])
    expect(wrapper.find('source').exists()).toBe(false)
    expect(wrapper.find('img').element.getAttribute('src')).toContain('blur_3')
  })

  it('swaps even if decoding the loaded image fails', async () => {
    const created = captureOffscreenImage()
    const wrapper = mount(NuxtPicture, {
      propsData: { src, placeholder: true },
    })
    const offscreen = created.offscreenImage()
    offscreen.decode = () => Promise.reject(new Error('decode failed'))
    offscreen.onload!(new Event('load'))
    await vi.waitFor(() => expect(wrapper.find('source').exists()).toBe(true))
  })

  it('does not render a placeholder for svg sources', () => {
    const created = captureOffscreenImage()
    const wrapper = mount(NuxtPicture, {
      propsData: { src: '/image.svg', placeholder: true },
    })
    expect(wrapper.html()).toMatchInlineSnapshot('"<picture><img data-nuxt-pic="" src="/image.svg"></picture>"')
    expect(created.offscreenPictures()).toHaveLength(0)
  })

  it('renders the regular markup without the placeholder prop', () => {
    const created = captureOffscreenImage()
    const wrapper = mount(NuxtPicture, { propsData: { src } })
    expect(wrapper.find('source').exists()).toBe(true)
    expect(created.offscreenPictures()).toHaveLength(0)
  })
})

describe('Renders image, applies module config', () => {
  let nuxtApp: ReturnType<typeof useNuxtApp>
  let config: RuntimeConfig
  const src = '/image.png'

  beforeEach(() => {
    nuxtApp = useNuxtApp()
    config = useRuntimeConfig()
    delete nuxtApp._img
  })

  it('Default module config', () => {
    const picture = mount(NuxtPicture, {
      propsData: {
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
        src,
      },
    })
    expect(picture.html()).toMatchInlineSnapshot(`
      "<picture>
        <source type="image/webp" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_webp&amp;s_200x200/image.png 200w, /_ipx/f_webp&amp;s_400x400/image.png 400w, /_ipx/f_webp&amp;s_500x500/image.png 500w, /_ipx/f_webp&amp;s_900x900/image.png 900w, /_ipx/f_webp&amp;s_1000x1000/image.png 1000w, /_ipx/f_webp&amp;s_1800x1800/image.png 1800w"><img width="200" height="200" data-nuxt-pic="" src="/_ipx/f_png&amp;s_1800x1800/image.png" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_png&amp;s_200x200/image.png 200w, /_ipx/f_png&amp;s_400x400/image.png 400w, /_ipx/f_png&amp;s_500x500/image.png 500w, /_ipx/f_png&amp;s_900x900/image.png 900w, /_ipx/f_png&amp;s_1000x1000/image.png 1000w, /_ipx/f_png&amp;s_1800x1800/image.png 1800w">
      </picture>"
    `)
  })

  it('Module config .format, single entry, no prop.format => module config applies', () => {
    nuxtApp._img = createImage({
      runtimeConfig: {} as any,
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
        createError,
      },
      format: ['avif'],
    })
    const picture = mount(NuxtPicture, {
      propsData: {
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
        src,
      },
    })
    expect(picture.html()).toMatchInlineSnapshot(`
      "<picture>
        <source type="image/avif" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_avif&amp;s_200x200/image.png 200w, /_ipx/f_avif&amp;s_400x400/image.png 400w, /_ipx/f_avif&amp;s_500x500/image.png 500w, /_ipx/f_avif&amp;s_900x900/image.png 900w, /_ipx/f_avif&amp;s_1000x1000/image.png 1000w, /_ipx/f_avif&amp;s_1800x1800/image.png 1800w"><img width="200" height="200" data-nuxt-pic="" src="/_ipx/f_png&amp;s_1800x1800/image.png" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_png&amp;s_200x200/image.png 200w, /_ipx/f_png&amp;s_400x400/image.png 400w, /_ipx/f_png&amp;s_500x500/image.png 500w, /_ipx/f_png&amp;s_900x900/image.png 900w, /_ipx/f_png&amp;s_1000x1000/image.png 1000w, /_ipx/f_png&amp;s_1800x1800/image.png 1800w">
      </picture>"
    `)
  })

  it('Module config .format, multiple entries, no prop.format => module config applies', () => {
    nuxtApp._img = createImage({
      runtimeConfig: {} as any,
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
        createError,
      },
      format: ['avif', 'webp'],
    })
    const picture = mount(NuxtPicture, {
      propsData: {
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
        src,
      },
    })
    expect(picture.html()).toMatchInlineSnapshot(`
      "<picture>
        <source type="image/avif" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_avif&amp;s_200x200/image.png 200w, /_ipx/f_avif&amp;s_400x400/image.png 400w, /_ipx/f_avif&amp;s_500x500/image.png 500w, /_ipx/f_avif&amp;s_900x900/image.png 900w, /_ipx/f_avif&amp;s_1000x1000/image.png 1000w, /_ipx/f_avif&amp;s_1800x1800/image.png 1800w">
        <source type="image/webp" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_webp&amp;s_200x200/image.png 200w, /_ipx/f_webp&amp;s_400x400/image.png 400w, /_ipx/f_webp&amp;s_500x500/image.png 500w, /_ipx/f_webp&amp;s_900x900/image.png 900w, /_ipx/f_webp&amp;s_1000x1000/image.png 1000w, /_ipx/f_webp&amp;s_1800x1800/image.png 1800w"><img width="200" height="200" data-nuxt-pic="" src="/_ipx/f_png&amp;s_1800x1800/image.png" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_png&amp;s_200x200/image.png 200w, /_ipx/f_png&amp;s_400x400/image.png 400w, /_ipx/f_png&amp;s_500x500/image.png 500w, /_ipx/f_png&amp;s_900x900/image.png 900w, /_ipx/f_png&amp;s_1000x1000/image.png 1000w, /_ipx/f_png&amp;s_1800x1800/image.png 1800w">
      </picture>"
    `)
  })

  it('Module config .format, multiple entries, prop.format override => prop is used (takes precedence)', () => {
    nuxtApp._img = createImage({
      runtimeConfig: {} as any,
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
        createError,
      },
      format: ['avif', 'webp'],
    })
    const picture = mount(NuxtPicture, {
      propsData: {
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
        format: 'avif',
        src,
      },
    })
    expect(picture.html()).toMatchInlineSnapshot(`
      "<picture>
        <source type="image/avif" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_avif&amp;s_200x200/image.png 200w, /_ipx/f_avif&amp;s_400x400/image.png 400w, /_ipx/f_avif&amp;s_500x500/image.png 500w, /_ipx/f_avif&amp;s_900x900/image.png 900w, /_ipx/f_avif&amp;s_1000x1000/image.png 1000w, /_ipx/f_avif&amp;s_1800x1800/image.png 1800w"><img width="200" height="200" data-nuxt-pic="" src="/_ipx/f_png&amp;s_1800x1800/image.png" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_png&amp;s_200x200/image.png 200w, /_ipx/f_png&amp;s_400x400/image.png 400w, /_ipx/f_png&amp;s_500x500/image.png 500w, /_ipx/f_png&amp;s_900x900/image.png 900w, /_ipx/f_png&amp;s_1000x1000/image.png 1000w, /_ipx/f_png&amp;s_1800x1800/image.png 1800w">
      </picture>"
    `)
  })

  it('Module config .format, multiple entries, no prop.format, svg image => renders src with svg only', () => {
    nuxtApp._img = createImage({
      runtimeConfig: {} as any,
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
        createError,
      },
      format: ['avif', 'webp'],
    })
    const picture = mount(NuxtPicture, {
      propsData: {
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
        src: 'image.svg',
      },
    })
    expect(picture.html()).toMatchInlineSnapshot('"<picture><img width="200" height="200" data-nuxt-pic="" src="image.svg"></picture>"')
  })

  it('Module config .quality applies', () => {
    nuxtApp._img = createImage({
      runtimeConfig: {} as any,
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
        createError,
      },
      quality: 75,
    })
    const picture = mount(NuxtPicture, {
      propsData: {
        src,
        width: 200,
        height: 200,
        sizes: '200,500:500,900:900',
      },
    })

    expect(picture.html()).toMatchInlineSnapshot(`
      "<picture>
        <source type="image/webp" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_webp&amp;q_75&amp;s_200x200/image.png 200w, /_ipx/f_webp&amp;q_75&amp;s_400x400/image.png 400w, /_ipx/f_webp&amp;q_75&amp;s_500x500/image.png 500w, /_ipx/f_webp&amp;q_75&amp;s_900x900/image.png 900w, /_ipx/f_webp&amp;q_75&amp;s_1000x1000/image.png 1000w, /_ipx/f_webp&amp;q_75&amp;s_1800x1800/image.png 1800w"><img width="200" height="200" data-nuxt-pic="" src="/_ipx/f_png&amp;q_75&amp;s_1800x1800/image.png" sizes="(max-width: 499px) 200px, (max-width: 899px) 500px, 900px" srcset="/_ipx/f_png&amp;q_75&amp;s_200x200/image.png 200w, /_ipx/f_png&amp;q_75&amp;s_400x400/image.png 400w, /_ipx/f_png&amp;q_75&amp;s_500x500/image.png 500w, /_ipx/f_png&amp;q_75&amp;s_900x900/image.png 900w, /_ipx/f_png&amp;q_75&amp;s_1000x1000/image.png 1000w, /_ipx/f_png&amp;q_75&amp;s_1800x1800/image.png 1800w">
      </picture>"
    `)
  })
})
