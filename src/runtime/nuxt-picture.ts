import { renderTag } from './utils'

export enum LazyState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded'
}
// @vue/component
export default {
  name: 'NuxtPicture',
  props: {
    src: {
      type: [String, Object],
      default: '',
      required: true
    },
    provider: {
      type: String,
      default: null
    },
    preset: {
      type: String,
      default: null
    },
    width: {
      type: [String, Number],
      default: ''
    },
    height: {
      type: [String, Number],
      default: ''
    },
    lazy: {
      type: Boolean,
      default: true
    },
    sizes: {
      type: [String, Array],
      default: ''
    },
    format: {
      type: String,
      default: null
    },
    fallbackFormat: {
      type: String,
      default: null
    },
    quality: {
      type: [Number, String],
      default: null
    },
    fit: {
      type: String,
      default: null
    },
    operations: {
      type: Object,
      default: () => ({})
    },
    placeholder: {
      type: [Boolean, String],
      default: false
    },
    layout: {
      type: String,
      default: 'default'
    },
    noScript: {
      type: Boolean,
      default: false
    },
    // `<img>` attrubutes
    alt: {
      type: String,
      default: ''
    },
    referrerpolicy: {
      type: String,
      default: undefined
    },
    usemap: {
      type: String,
      default: undefined
    },
    longdesc: {
      type: String,
      default: undefined
    },
    ismap: {
      type: Boolean,
      default: false
    },
    crossorigin: {
      type: Boolean,
      default: false
    }
  },
  async fetch () {
    await this.fetchMeta()

    // Ensure images sizes are calculate in static generation process
    // and files are store in output direcotry
    if (this.$nuxt.context.ssrContext && this.$nuxt.context.ssrContext.isGenerating) {
      // eslint-disable-next-line no-unused-expressions
      this.sources
    }
  },
  data () {
    return {
      error: '',
      meta: {
        width: undefined,
        height: undefined,
        placeholder: undefined
      },
      lazyState: this.lazy ? LazyState.IDLE : LazyState.LOADED
    }
  },
  computed: {
    computedOperations () {
      return {
        fit: this.fit,
        quality: this.quality,
        ...this.operations
      }
    },
    imageRatio () {
      if (this.height && this.width) {
        return (parseInt(this.height, 10) / parseInt(this.width, 10)) * 100
      }

      if (this.meta.width && this.meta.height) {
        return (this.meta.height / this.meta.width) * 100
      }

      return 0
    },
    imgAttributes () {
      const alt = this.alt ? this.alt : this.src.split(/[?#]/).shift().split('/').pop().split('.').shift()
      return {
        alt,
        referrerpolicy: this.referrerpolicy,
        usemap: this.usemap,
        longdesc: this.longdesc,
        ismap: this.ismap,
        crossorigin: this.crossorigin
      }
    },
    sources () {
      const sizes = this.sizes || ['responsive'].includes(this.layout)
      return this.$img.sizes(this.src, sizes, {
        provider: this.provider,
        preset: this.preset,
        modifiers: {
          format: this.format,
          ...this.computedOperations
        }
      })
    },
    generatedSrc () {
      const [source] = this.sources
      if (source) {
        if (this.fallbackFormat) {
          return this.generateSizedImage(source.width, source.height, this.fallbackFormat)
        } else {
          return this.sources[0].url
        }
      }
      return this.src
    }
  },
  watch: {
    src () {
      this.fetchMeta()

      if (this.lazy) {
        this.$img.$observer.remove(this.$el)
        this.$img.$observer.add(this.$el, this.onObserverEvent)
      }
    }
  },
  mounted () {
    if (this.lazy) {
      this.$img.$observer.add(this.$el, this.onObserverEvent)
    }
  },
  beforeDestroy () {
    if (this.lazy) {
      this.$img.$observer.remove(this.$el)
    }
  },
  methods: {
    async fetchMeta () {
      if (!this.placeholder && this.width && this.height) {
        return
      }
      try {
        const { width, height, placeholder } = await this.$img.getMeta(this.src, this.computedOperations)

        Object.assign(this.meta, {
          width,
          height,
          placeholder: typeof this.placeholder === 'string' ? this.placeholder : this.placeholder && placeholder
        })
      } catch (e) {
        this.onError(e)
        return ''
      }
    },
    generateSizedImage (width: number, height: number, format: string) {
      try {
        const image = this.$img(this.src, {
          provider: this.provider,
          preset: this.preset,
          modifiers: {
            width,
            height,
            format,
            ...this.computedOperations
          }
        })
        return encodeURI(image.url)
      } catch (e) {
        this.onError(e)
        return ''
      }
    },
    loadOriginalImage () {
      this.lazyState = LazyState.LOADING
    },
    onError (e: Error) {
      this.error = e.message
      // eslint-disable-next-line no-console
      console.error(e.message)
      this.$emit('error', e)
    },
    // hanlde onLoad event of original image element
    onImageLoaded () {
      if (this.lazyState !== LazyState.LOADED) {
        this.lazyState = LazyState.LOADED
        this.$emit('load')
      }
    },
    onObserverEvent (type) {
      if (type === 'onIntersect') {
        // OK, element is visible, Hoooray
        this.loadOriginalImage()
        return
      }
      if (type === 'onPrint') {
        this.$img.$observer.remove(this.$el)
        this.lazyState = LazyState.LOADED
      }
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
    }))

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
        opacity: this.lazyState === LazyState.IDLE ? 0 : 1
      },
      attrs: {
        src: this.lazyState === LazyState.IDLE ? undefined : this.generatedSrc,
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
          // disable blur filter on custom placeholder
          filter: typeof this.placeholder === 'string' ? undefined : 'blur(10px)',
          transition: 'opacity 1s',
          opacity: this.lazyState === LazyState.LOADED ? 0 : 1
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
      },
      on: {
        click: $event => this.$emit('click', $event)
      }
    }, [placeholder, picture, noScript, ratioBox])

    return wrapper
  }
}
