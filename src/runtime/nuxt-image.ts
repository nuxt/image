import { renderTag } from './utils'

import nuxtImageMixin, { LazyState } from './nuxt-image-mixins'

import './nuxt-image.css'

// @vue/component
export default {
  name: 'NuxtImage',
  mixins: [nuxtImageMixin],
  computed: {
    generatedSrcset () {
      return this.sizes.map(({ width, url }) => width ? `${url} ${width}w` : url).join(', ')
    },
    generatedSizes () {
      return this.sizes.map(({ width, media }) => media ? `${media} ${width}px` : `${width}px`).reverse().join(', ')
    },
    generatedSrc () {
      if (this.sizes.length) {
        return this.sizes[0].url
      }
      return this.src
    }
  },
  render (h) {
    if (this.error) {
      return h('div', {
        class: ['__nim_w'].concat(this.$attrs.class || '')
      }, [this.error])
    }
    if (!this.lazy && !this.placeholder) {
      return h('img', {
        class: '__nim_o',
        attrs: {
          src: this.generatedSrc,
          srcset: this.generatedSrcset,
          sizes: this.generatedSizes,
          ...this.imgAttributes
        }
      })
    }

    let placeholder = null
    if (this.placeholder && this.meta.placeholder) {
      placeholder = h('img', {
        class: '__nim_p',
        attrs: {
          src: this.meta.placeholder
        }
      })
    }

    const originalImage = h('img', {
      class: '__nim_o',
      attrs: {
        src: this.lazyState !== LazyState.IDLE ? this.generatedSrc : undefined,
        srcset: this.lazyState !== LazyState.IDLE ? this.generatedSrcset : undefined,
        sizes: this.lazyState !== LazyState.IDLE ? this.generatedSizes : undefined,
        ...this.imgAttributes
      },
      on: {
        load: this.onImageLoaded
      }
    })

    let noScript = null
    if (this.noScript) {
      noScript = h('noscript', {
        domProps: {
          innerHTML: renderTag('img', {
            class: '__nim_o',
            src: this.generatedSrc,
            srcset: this.generatedSrcset,
            sizes: this.generatedSizes,
            ...this.imgAttributes
          })
        }
      })
    }

    const ratioBox = h('div', {
      class: '__nim_r',
      style: {
        paddingBottom: this.imageRatio ? `${this.imageRatio}%` : undefined
      }
    })

    const wrapper = h('div', {
      class: ['__nim_w', this.lazyState === LazyState.LOADED ? 'visible' : ''].concat(this.$attrs.class || '')
    }, [placeholder, originalImage, noScript, ratioBox])

    return wrapper
  }
}
