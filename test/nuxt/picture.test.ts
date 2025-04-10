import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { NuxtPicture } from '#components'
import { useNuxtApp, useRuntimeConfig } from '#imports'
import { imageOptions } from '#build/image-options.mjs'
import { createImage } from '#image'

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
        <source type="image/webp" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_webp&amp;s_200x200/image.png 200w, /_ipx/f_webp&amp;s_400x400/image.png 400w, /_ipx/f_webp&amp;s_500x500/image.png 500w, /_ipx/f_webp&amp;s_900x900/image.png 900w, /_ipx/f_webp&amp;s_1000x1000/image.png 1000w, /_ipx/f_webp&amp;s_1800x1800/image.png 1800w"><img width="200" height="200" data-nuxt-pic="" loading="lazy" src="/_ipx/f_png&amp;s_1800x1800/image.png" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_png&amp;s_200x200/image.png 200w, /_ipx/f_png&amp;s_400x400/image.png 400w, /_ipx/f_png&amp;s_500x500/image.png 500w, /_ipx/f_png&amp;s_900x900/image.png 900w, /_ipx/f_png&amp;s_1000x1000/image.png 1000w, /_ipx/f_png&amp;s_1800x1800/image.png 1800w">
      </picture>"
    `)
  })

  it.todo('alt attribute is generated')

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
    expect(sizes).toMatchInlineSnapshot('"(max-width: 500px) 200px, (max-width: 900px) 500px, 900px"')
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
        <source type="image/webp" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_webp&amp;s_200x200/%E6%B1%89%E5%AD%97.png 200w, /_ipx/f_webp&amp;s_400x400/%E6%B1%89%E5%AD%97.png 400w, /_ipx/f_webp&amp;s_500x500/%E6%B1%89%E5%AD%97.png 500w, /_ipx/f_webp&amp;s_900x900/%E6%B1%89%E5%AD%97.png 900w, /_ipx/f_webp&amp;s_1000x1000/%E6%B1%89%E5%AD%97.png 1000w, /_ipx/f_webp&amp;s_1800x1800/%E6%B1%89%E5%AD%97.png 1800w"><img width="200" height="200" data-nuxt-pic="" loading="lazy" src="/_ipx/f_png&amp;s_1800x1800/%E6%B1%89%E5%AD%97.png" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_png&amp;s_200x200/%E6%B1%89%E5%AD%97.png 200w, /_ipx/f_png&amp;s_400x400/%E6%B1%89%E5%AD%97.png 400w, /_ipx/f_png&amp;s_500x500/%E6%B1%89%E5%AD%97.png 500w, /_ipx/f_png&amp;s_900x900/%E6%B1%89%E5%AD%97.png 900w, /_ipx/f_png&amp;s_1000x1000/%E6%B1%89%E5%AD%97.png 1000w, /_ipx/f_png&amp;s_1800x1800/%E6%B1%89%E5%AD%97.png 1800w">
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

describe('Renders image, applies module config', () => {
  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()
  const src = '/image.png'

  beforeEach(() => {
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
        <source type="image/webp" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_webp&amp;s_200x200/image.png 200w, /_ipx/f_webp&amp;s_400x400/image.png 400w, /_ipx/f_webp&amp;s_500x500/image.png 500w, /_ipx/f_webp&amp;s_900x900/image.png 900w, /_ipx/f_webp&amp;s_1000x1000/image.png 1000w, /_ipx/f_webp&amp;s_1800x1800/image.png 1800w"><img width="200" height="200" data-nuxt-pic="" src="/_ipx/f_png&amp;s_1800x1800/image.png" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_png&amp;s_200x200/image.png 200w, /_ipx/f_png&amp;s_400x400/image.png 400w, /_ipx/f_png&amp;s_500x500/image.png 500w, /_ipx/f_png&amp;s_900x900/image.png 900w, /_ipx/f_png&amp;s_1000x1000/image.png 1000w, /_ipx/f_png&amp;s_1800x1800/image.png 1800w">
      </picture>"
    `)
  })

  it('Module config .format, single entry, no prop.format => module config applies', () => {
    nuxtApp._img = createImage({
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
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
        <source type="image/avif" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_avif&amp;s_200x200/image.png 200w, /_ipx/f_avif&amp;s_400x400/image.png 400w, /_ipx/f_avif&amp;s_500x500/image.png 500w, /_ipx/f_avif&amp;s_900x900/image.png 900w, /_ipx/f_avif&amp;s_1000x1000/image.png 1000w, /_ipx/f_avif&amp;s_1800x1800/image.png 1800w"><img width="200" height="200" data-nuxt-pic="" src="/_ipx/f_png&amp;s_1800x1800/image.png" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_png&amp;s_200x200/image.png 200w, /_ipx/f_png&amp;s_400x400/image.png 400w, /_ipx/f_png&amp;s_500x500/image.png 500w, /_ipx/f_png&amp;s_900x900/image.png 900w, /_ipx/f_png&amp;s_1000x1000/image.png 1000w, /_ipx/f_png&amp;s_1800x1800/image.png 1800w">
      </picture>"
    `)
  })

  it('Module config .format, multiple entries, no prop.format => module config applies', () => {
    nuxtApp._img = createImage({
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
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
        <source type="image/avif" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_avif&amp;s_200x200/image.png 200w, /_ipx/f_avif&amp;s_400x400/image.png 400w, /_ipx/f_avif&amp;s_500x500/image.png 500w, /_ipx/f_avif&amp;s_900x900/image.png 900w, /_ipx/f_avif&amp;s_1000x1000/image.png 1000w, /_ipx/f_avif&amp;s_1800x1800/image.png 1800w">
        <source type="image/webp" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_webp&amp;s_200x200/image.png 200w, /_ipx/f_webp&amp;s_400x400/image.png 400w, /_ipx/f_webp&amp;s_500x500/image.png 500w, /_ipx/f_webp&amp;s_900x900/image.png 900w, /_ipx/f_webp&amp;s_1000x1000/image.png 1000w, /_ipx/f_webp&amp;s_1800x1800/image.png 1800w"><img width="200" height="200" data-nuxt-pic="" src="/_ipx/f_png&amp;s_1800x1800/image.png" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_png&amp;s_200x200/image.png 200w, /_ipx/f_png&amp;s_400x400/image.png 400w, /_ipx/f_png&amp;s_500x500/image.png 500w, /_ipx/f_png&amp;s_900x900/image.png 900w, /_ipx/f_png&amp;s_1000x1000/image.png 1000w, /_ipx/f_png&amp;s_1800x1800/image.png 1800w">
      </picture>"
    `)
  })

  it('Module config .format, multiple entries, prop.format override => prop is used (takes precedence)', () => {
    nuxtApp._img = createImage({
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
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
        <source type="image/avif" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_avif&amp;s_200x200/image.png 200w, /_ipx/f_avif&amp;s_400x400/image.png 400w, /_ipx/f_avif&amp;s_500x500/image.png 500w, /_ipx/f_avif&amp;s_900x900/image.png 900w, /_ipx/f_avif&amp;s_1000x1000/image.png 1000w, /_ipx/f_avif&amp;s_1800x1800/image.png 1800w"><img width="200" height="200" data-nuxt-pic="" src="/_ipx/f_png&amp;s_1800x1800/image.png" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_png&amp;s_200x200/image.png 200w, /_ipx/f_png&amp;s_400x400/image.png 400w, /_ipx/f_png&amp;s_500x500/image.png 500w, /_ipx/f_png&amp;s_900x900/image.png 900w, /_ipx/f_png&amp;s_1000x1000/image.png 1000w, /_ipx/f_png&amp;s_1800x1800/image.png 1800w">
      </picture>"
    `)
  })

  it('Module config .format, multiple entries, no prop.format, svg image => renders src with svg only', () => {
    nuxtApp._img = createImage({
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
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
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL,
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
        <source type="image/webp" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_webp&amp;q_75&amp;s_200x200/image.png 200w, /_ipx/f_webp&amp;q_75&amp;s_400x400/image.png 400w, /_ipx/f_webp&amp;q_75&amp;s_500x500/image.png 500w, /_ipx/f_webp&amp;q_75&amp;s_900x900/image.png 900w, /_ipx/f_webp&amp;q_75&amp;s_1000x1000/image.png 1000w, /_ipx/f_webp&amp;q_75&amp;s_1800x1800/image.png 1800w"><img width="200" height="200" data-nuxt-pic="" src="/_ipx/f_png&amp;q_75&amp;s_1800x1800/image.png" sizes="(max-width: 500px) 200px, (max-width: 900px) 500px, 900px" srcset="/_ipx/f_png&amp;q_75&amp;s_200x200/image.png 200w, /_ipx/f_png&amp;q_75&amp;s_400x400/image.png 400w, /_ipx/f_png&amp;q_75&amp;s_500x500/image.png 500w, /_ipx/f_png&amp;q_75&amp;s_900x900/image.png 900w, /_ipx/f_png&amp;q_75&amp;s_1000x1000/image.png 1000w, /_ipx/f_png&amp;q_75&amp;s_1800x1800/image.png 1800w">
      </picture>"
    `)
  })
})
