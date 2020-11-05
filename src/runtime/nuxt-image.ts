import { renderTag } from './utils'

import nuxtImageMixin, { LazyState } from './nuxt-image-mixins'

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
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          margin: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          filter: 'blur(15px)',
          transform: 'scale(1.1)'
        },
        attrs: {
          src: this.meta.placeholder
        }
      })
    }

    const originalImage = h('img', {
      class: '__nim_o',
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        margin: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center center',
        transition: 'opacity 800ms ease 0ms',
        opacity: 0,
        ...(this.lazyState === LazyState.LOADED ? {
          opacity: 1
        } : {})
      },
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
        width: '100%',
        paddingBottom: this.imageRatio ? `${this.imageRatio}%` : undefined
      }
    })

    const wrapper = h('div', {
      class: this.$attrs.class,
      style: {
        position: 'relative',
        overflow: 'hidden'
      },
      on: {
        click: event => this.$emit('click', event)
      }
    }, [placeholder, originalImage, noScript, ratioBox])

    return wrapper
  }
}
