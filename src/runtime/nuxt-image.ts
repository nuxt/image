import nuxtImageMixin, { LazyState } from './nuxt-image-mixins'
import { renderTag } from './utils'

// @vue/component
export default {
  name: 'NuxtImage',
  mixins: [nuxtImageMixin],
  computed: {
    generatedSrcset () {
      if (!Array.isArray(this.sources) || this.sources.length < 2) {
        return undefined
      }
      return this.sources.map(({ width, url }) => width ? `${url} ${width}w` : url).join(', ')
    },
    generatedSizes () {
      if (!Array.isArray(this.sources) || this.sources.length < 2) {
        return undefined
      }
      return this.sources.map(({ width, media }) => media ? `${media} ${width}px` : `${width}px`).reverse().join(', ')
    },
    generatedSrc () {
      if (this.sources.length) {
        return this.sources[0].url
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
          src: this.meta.placeholder,
          'aria-hidden': 'true'
        }
      })
    }

    let originalImage = null
    if (this.lazyState !== LazyState.IDLE) {
      originalImage = h('img', {
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
          opacity: this.lazyState === LazyState.LOADED ? 1 : 0
        },
        attrs: {
          src: this.generatedSrc,
          srcset: this.generatedSrcset,
          sizes: this.generatedSizes,
          ...this.imgAttributes
        },
        on: {
          load: this.onImageLoaded
        }
      })
    }

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
      attrs: {
        'aria-hidden': 'true'
      },
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
