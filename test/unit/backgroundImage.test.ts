// @vitest-environment nuxt

import type { Mock } from 'vitest'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
// @ts-expect-error virtual file
import { imageOptions } from '#build/image-options'
import { createImage } from '#image'
import { useBackgroundImage, useHead, useNuxtApp } from '#imports'

mockNuxtImport('useHead', () => {
  return vi.fn()
})
describe('Renders simple image', () => {
  const src = '/image.png'

  beforeEach(() => {
    (useHead as Mock).mockClear()
  })

  it('only src', () => {
    const cls = useBackgroundImage(src, {})
    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/_/image.png);background-image: image-set(url('/_ipx/_/image.png') 1x , url('/_ipx/_/image.png') 2x );}`
        }
      ]
    })
  })

  it('applies sizes', () => {
    const cls = useBackgroundImage(src, { sizes: '200,500:500,900:900' })

    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/w_900/image.png);background-image: image-set(url('/_ipx/w_900/image.png') 1x , url('/_ipx/w_1800/image.png') 2x );}@media (max-width: 900px) { .${cls} { background-image: url(/_ipx/w_500/image.png);background-image: image-set(url('/_ipx/w_500/image.png') 1x , url('/_ipx/w_1000/image.png') 2x ); } } @media (max-width: 500px) { .${cls} { background-image: url(/_ipx/w_200/image.png);background-image: image-set(url('/_ipx/w_200/image.png') 1x , url('/_ipx/w_400/image.png') 2x ); } }`
        }
      ]
    })
  })

  it('applies densities', () => {
    const cls = useBackgroundImage(src, {
      sizes: '200,500:500,900:900',
      densities: '1x 2x 3x'
    })

    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/w_900/image.png);background-image: image-set(url('/_ipx/w_900/image.png') 1x , url('/_ipx/w_1800/image.png') 2x , url('/_ipx/w_2700/image.png') 3x );}@media (max-width: 900px) { .${cls} { background-image: url(/_ipx/w_500/image.png);background-image: image-set(url('/_ipx/w_500/image.png') 1x , url('/_ipx/w_1000/image.png') 2x , url('/_ipx/w_1500/image.png') 3x ); } } @media (max-width: 500px) { .${cls} { background-image: url(/_ipx/w_200/image.png);background-image: image-set(url('/_ipx/w_200/image.png') 1x , url('/_ipx/w_400/image.png') 2x , url('/_ipx/w_600/image.png') 3x ); } }`
        }
      ]
    })
  })

  it('empty densities (fallback to global)', () => {
    const cls = useBackgroundImage(src, {
      sizes: '200,500:500,900:900',
      densities: ''
    })

    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/w_900/image.png);background-image: image-set(url('/_ipx/w_900/image.png') 1x , url('/_ipx/w_1800/image.png') 2x );}@media (max-width: 900px) { .${cls} { background-image: url(/_ipx/w_500/image.png);background-image: image-set(url('/_ipx/w_500/image.png') 1x , url('/_ipx/w_1000/image.png') 2x ); } } @media (max-width: 500px) { .${cls} { background-image: url(/_ipx/w_200/image.png);background-image: image-set(url('/_ipx/w_200/image.png') 1x , url('/_ipx/w_400/image.png') 2x ); } }`
        }
      ]
    })
  })

  it('empty string densities (fallback to global)', () => {
    const cls = useBackgroundImage(src, {
      sizes: '200,500:500,900:900',
      densities: '  '
    })

    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/w_900/image.png);background-image: image-set(url('/_ipx/w_900/image.png') 1x , url('/_ipx/w_1800/image.png') 2x );}@media (max-width: 900px) { .${cls} { background-image: url(/_ipx/w_500/image.png);background-image: image-set(url('/_ipx/w_500/image.png') 1x , url('/_ipx/w_1000/image.png') 2x ); } } @media (max-width: 500px) { .${cls} { background-image: url(/_ipx/w_200/image.png);background-image: image-set(url('/_ipx/w_200/image.png') 1x , url('/_ipx/w_400/image.png') 2x ); } }`
        }
      ]
    })
  })

  it('error on invalid densities', () => {
    expect(() =>
      useBackgroundImage(src, { sizes: '200,500:500,900:900', densities: 'x' })
    ).toThrow(Error)
  })

  it('with single sizes entry', () => {
    const cls = useBackgroundImage(src, {
      sizes: '150',
      modifiers: { width: 300, height: 400 }
    })
    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/s_150x200/image.png);background-image: image-set(url('/_ipx/s_150x200/image.png') 1x , url('/_ipx/s_300x400/image.png') 2x );}`
        }
      ]
    })
  })

  it('with single sizes entry (responsive)', () => {
    const cls = useBackgroundImage(src, {
      sizes: 'sm:150',
      modifiers: { width: 300, height: 400 }
    })
    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/s_150x200/image.png);background-image: image-set(url('/_ipx/s_150x200/image.png') 1x , url('/_ipx/s_300x400/image.png') 2x );}`
        }
      ]
    })
  })

  it('de-duplicates sizes', () => {
    const cls = useBackgroundImage(src, {
      sizes: '200:200px,300:200px,400:400px,400:400px,500:500px,800:800px',
      modifiers: { width: 200, height: 300 }
    })

    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/s_800x1200/image.png);background-image: image-set(url('/_ipx/s_800x1200/image.png') 1x , url('/_ipx/s_1600x2400/image.png') 2x );}@media (max-width: 800px) { .${cls} { background-image: url(/_ipx/s_500x750/image.png);background-image: image-set(url('/_ipx/s_500x750/image.png') 1x , url('/_ipx/s_1000x1500/image.png') 2x ); } } @media (max-width: 500px) { .${cls} { background-image: url(/_ipx/s_400x600/image.png);background-image: image-set(url('/_ipx/s_400x600/image.png') 1x , url('/_ipx/s_800x1200/image.png') 2x ); } } @media (max-width: 400px) { .${cls} { background-image: url(/_ipx/s_200x300/image.png);background-image: image-set(url('/_ipx/s_200x300/image.png') 1x , url('/_ipx/s_400x600/image.png') 2x ); } } @media (max-width: 300px) { .${cls} { background-image: url(/_ipx/s_200x300/image.png);background-image: image-set(url('/_ipx/s_200x300/image.png') 1x , url('/_ipx/s_400x600/image.png') 2x ); } }`
        }
      ]
    })
  })

  it('encodes characters', () => {
    const cls = useBackgroundImage('/汉字.png', {
      sizes: '200,500:500,900:900'
    })

    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/w_900/%E6%B1%89%E5%AD%97.png);background-image: image-set(url('/_ipx/w_900/%E6%B1%89%E5%AD%97.png') 1x , url('/_ipx/w_1800/%E6%B1%89%E5%AD%97.png') 2x );}@media (max-width: 900px) { .${cls} { background-image: url(/_ipx/w_500/%E6%B1%89%E5%AD%97.png);background-image: image-set(url('/_ipx/w_500/%E6%B1%89%E5%AD%97.png') 1x , url('/_ipx/w_1000/%E6%B1%89%E5%AD%97.png') 2x ); } } @media (max-width: 500px) { .${cls} { background-image: url(/_ipx/w_200/%E6%B1%89%E5%AD%97.png);background-image: image-set(url('/_ipx/w_200/%E6%B1%89%E5%AD%97.png') 1x , url('/_ipx/w_400/%E6%B1%89%E5%AD%97.png') 2x ); } }`
        }
      ]
    })
  })

  it('correctly sets crop', () => {
    const cls = useBackgroundImage('/image.png', {
      modifiers: {
        width: 1000,
        height: 2000
      },
      sizes: 'xs:100vw sm:100vw md:300px lg:350px xl:350px 2xl:350px'
    })

    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/s_350x700/image.png);background-image: image-set(url('/_ipx/s_350x700/image.png') 1x , url('/_ipx/s_700x1400/image.png') 2x );}@media (max-width: 1536px) { .${cls} { background-image: url(/_ipx/s_350x700/image.png);background-image: image-set(url('/_ipx/s_350x700/image.png') 1x , url('/_ipx/s_700x1400/image.png') 2x ); } } @media (max-width: 1280px) { .${cls} { background-image: url(/_ipx/s_350x700/image.png);background-image: image-set(url('/_ipx/s_350x700/image.png') 1x , url('/_ipx/s_700x1400/image.png') 2x ); } } @media (max-width: 1024px) { .${cls} { background-image: url(/_ipx/s_300x600/image.png);background-image: image-set(url('/_ipx/s_300x600/image.png') 1x , url('/_ipx/s_600x1200/image.png') 2x ); } } @media (max-width: 768px) { .${cls} { background-image: url(/_ipx/s_640x1280/image.png);background-image: image-set(url('/_ipx/s_640x1280/image.png') 1x , url('/_ipx/s_1280x2560/image.png') 2x ); } } @media (max-width: 640px) { .${cls} { background-image: url(/_ipx/s_320x640/image.png);background-image: image-set(url('/_ipx/s_320x640/image.png') 1x , url('/_ipx/s_640x1280/image.png') 2x ); } }`
        }
      ]
    })
  })

  it('without sizes, but densities', () => {
    const cls = useBackgroundImage(src, {
      modifiers: { width: 300, height: 400 },
      densities: '1x 2x 3x'
    })
    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/s_300x400/image.png);background-image: image-set(url('/_ipx/s_300x400/image.png') 1x , url('/_ipx/s_600x800/image.png') 2x , url('/_ipx/s_900x1200/image.png') 3x );}`
        }
      ]
    })
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
        baseURL: config.app.baseURL
      },
      quality: 75
    })
    const cls = useBackgroundImage(src, {
      modifiers: { width: 200, height: 200 },
      sizes: '200,500:500,900:900'
    })

    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/q_75&s_900x900/image.png);background-image: image-set(url('/_ipx/q_75&s_900x900/image.png') 1x , url('/_ipx/q_75&s_1800x1800/image.png') 2x );}@media (max-width: 900px) { .${cls} { background-image: url(/_ipx/q_75&s_500x500/image.png);background-image: image-set(url('/_ipx/q_75&s_500x500/image.png') 1x , url('/_ipx/q_75&s_1000x1000/image.png') 2x ); } } @media (max-width: 500px) { .${cls} { background-image: url(/_ipx/q_75&s_200x200/image.png);background-image: image-set(url('/_ipx/q_75&s_200x200/image.png') 1x , url('/_ipx/q_75&s_400x400/image.png') 2x ); } }`
        }
      ]
    })
  })

  it('Module config .quality + props.quality => props.quality applies', () => {
    nuxtApp._img = createImage({
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL
      },
      quality: 75
    })
    const cls = useBackgroundImage(src, {
      modifiers: { width: 200, height: 200, quality: 90 },
      sizes: '200,500:500,900:900'
    })

    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/q_90&s_900x900/image.png);background-image: image-set(url('/_ipx/q_90&s_900x900/image.png') 1x , url('/_ipx/q_90&s_1800x1800/image.png') 2x );}@media (max-width: 900px) { .${cls} { background-image: url(/_ipx/q_90&s_500x500/image.png);background-image: image-set(url('/_ipx/q_90&s_500x500/image.png') 1x , url('/_ipx/q_90&s_1000x1000/image.png') 2x ); } } @media (max-width: 500px) { .${cls} { background-image: url(/_ipx/q_90&s_200x200/image.png);background-image: image-set(url('/_ipx/q_90&s_200x200/image.png') 1x , url('/_ipx/q_90&s_400x400/image.png') 2x ); } }`
        }
      ]
    })
  })

  it('Without quality config => default image', () => {
    nuxtApp._img = createImage({
      ...imageOptions,
      nuxt: {
        baseURL: config.app.baseURL
      }
    })
    const cls = useBackgroundImage(src, {
      modifiers: { width: 200, height: 200 },
      sizes: '200,500:500,900:900'
    })

    expect(useHead).toBeCalledWith({
      style: [
        {
          id: cls,
          innerHTML: `.${cls}{background-image: url(/_ipx/s_900x900/image.png);background-image: image-set(url('/_ipx/s_900x900/image.png') 1x , url('/_ipx/s_1800x1800/image.png') 2x );}@media (max-width: 900px) { .${cls} { background-image: url(/_ipx/s_500x500/image.png);background-image: image-set(url('/_ipx/s_500x500/image.png') 1x , url('/_ipx/s_1000x1000/image.png') 2x ); } } @media (max-width: 500px) { .${cls} { background-image: url(/_ipx/s_200x200/image.png);background-image: image-set(url('/_ipx/s_200x200/image.png') 1x , url('/_ipx/s_400x400/image.png') 2x ); } }`
        }
      ]
    })
  })
})
