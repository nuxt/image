import nuxtImageMixin, { LazyState } from './nuxt-image-mixins'
import { renderTag, isModernFormat } from './utils'

// @vue/component
export default {
  name: 'NuxtPicture',
  mixins: [nuxtImageMixin],
  computed: {
    generatedSrc () {
      const [source] = this.sources
      if (source) {
        if (isModernFormat(source.format) || isModernFormat(source.url)) {
          return this.generateSizedImage(source.width, source.height, 'jpeg')
        } else {
          return this.sources[0].url
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
    const sources = this.sources.map(source => h('source', {
      attrs: {
        srcset: source.url,
        type: source.format,
        media: source.media
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

    const picture = this.lazyState === LazyState.IDLE ? null : h('picture', {}, [
      ...sources,
      originalImage
    ])

    let noScript = null
    if (this.noScript) {
      const noScriptSources = this.sources.map(source => renderTag('source', {
        type: source.type,
        media: source.media,
        url: source.url
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
      attrs: {
        'aria-hidden': 'true'
      },
      style: {
        paddingBottom: this.imageRatio ? `${this.imageRatio}%` : undefined
      }
    })

    const wrapper = h('div', {
      class: this.$attrs.class,
      style: {
        position: 'relative',
        overflow: 'hidden'
      }
    }, [placeholder, picture, noScript, ratioBox])

    return wrapper
  }
}
