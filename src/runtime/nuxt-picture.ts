import nuxtImageMixin, { LazyState } from './nuxt-image-mixins'
import './nuxt-image.css'
import { renderTag, isModernFormat } from './utils'

// @vue/component
export default {
  name: 'NuxtPicture',
  mixins: [nuxtImageMixin],
  computed: {
    generatedSrc () {
      const [size] = this.sizes
      if (size) {
        if (isModernFormat(size.format) || isModernFormat(size.url)) {
          return this.generateSizedImage(size.width, size.height, 'jpeg')
        } else {
          return this.sizes[0].url
        }
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
    const sources = this.sizes.map(size => h('source', {
      attrs: {
        srcset: size.url,
        type: size.format ? size.format : undefined,
        media: size.media ? size.media : undefined
      }
    })).reverse()

    if (!this.lazy && !this.placeholder) {
      const originalImage = h('img', {
        class: '__nim_o',
        attrs: {
          src: this.generatedSrc,
          ...this.imgAttributes
        }
      })

      return h('picture', {}, [
        ...sources,
        originalImage
      ])
    }

    const originalImage = h('img', {
      class: ['__nim_o'],
      attrs: {
        src: this.lazyState !== LazyState.IDLE ? this.generatedSrc : undefined,
        ...this.imgAttributes
      },
      on: {
        load: this.onImageLoaded
      }
    })

    let placeholder = null
    if (this.placeholder && this.meta.placeholder) {
      placeholder = h('img', {
        class: '__nim_p',
        attrs: {
          src: this.meta.placeholder
        }
      })
    }

    const picture = h('picture', {}, [
      ...sources,
      originalImage
    ])

    let noScript = null
    if (this.noScript) {
      const noScriptSources = this.sizes.map(size => renderTag('source', {
        type: size.type,
        media: size.media,
        url: size.url
      })).join('')

      const noScriptImg = renderTag('img', {
        class: '__nim_o',
        src: this.generatedSrc,
        ...this.imgAttributes
      })

      noScript = h('noscript', {
        domProps: {
          innerHTML: renderTag('img', {
            class: '__nim_o'
          }, noScriptSources + noScriptImg)
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
      class: ['__nim_w', this.lazyState === LazyState.LOADED ? 'visible' : '']
    }, [placeholder, picture, noScript, ratioBox])

    return wrapper
  }
}
