import { renderTag, getInt } from './utils'
import { props } from './nuxt-img'

export enum LazyState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded'
}
// @vue/component
export default {
  name: 'NuxtPicture',
  props: {
    ...props,
    width: {
      type: [String, Number],
      default: 'auto'
    },
    height: {
      type: [String, Number],
      default: 'auto'
    },
    // TODO: rename lazy to loading
    loading: {
      type: String,
      default: undefined,
      validator (value) {
        return !value || ['lazy', 'eager'].includes(value)
      }
    },
    fallbackFormat: {
      type: String,
      default: null
    },
    placeholder: {
      type: [Boolean, String],
      default: false
    },
    noScript: {
      type: Boolean,
      default: false
    },
    // <img> props to forward
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
      lazyState: this.isLazy ? LazyState.IDLE : LazyState.LOADED
    }
  },
  computed: {
    isLazy () {
      return this.loading === 'lazy'
    },
    modifiers () {
      return {
        fit: this.fit,
        quality: this.quality,
        background: this.background,
        ...this.operations
      }
    },
    imageRatio () {
      return (this.meta.height / this.meta.width) * 100
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
      const sources = this.$img.sizes(this.src, sizes, {
        provider: this.provider,
        preset: this.preset,
        modifiers: {
          format: this.format,
          ...this.modifiers
        }
      })
      if (sources.length < 2) {
        return []
      }
      return sources
    },
    generatedSrc () {
      if (this.meta.src) {
        return this.meta.src
      }
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

      if (this.isLazy) {
        this.$img.$observer.remove(this.$el)
        this.$img.$observer.add(this.$el, this.onObserverEvent)
      }
    }
  },
  mounted () {
    if (this.isLazy) {
      this.$img.$observer.add(this.$el, this.onObserverEvent)
    }
  },
  beforeDestroy () {
    if (this.isLazy) {
      this.$img.$observer.remove(this.$el)
    }
  },
  methods: {
    async fetchMeta () {
      if (typeof this.placeholder === 'string') {
        this.meta.placeholder = this.placeholder
      } else if (this.placeholder === true) {
        try {
          const { placeholder } = await this.$img.getMeta(this.src, {
            modifiers: this.modifiers,
            provider: this.provider,
            preset: this.preset
          })
          this.meta.placeholder = placeholder
        } catch (e) {
          this.onError(e)
          return
        }
      }

      const { width, height } = await this.$img.getResolution(this.src, {
        provider: this.provider,
        preset: this.preset,
        modifiers: this.modifiers
      })
      const ratio = height / width

      if (!this.width && !this.height) {
        this.meta.height = height
        this.meta.width = width
        return
      }
      if (this.height === 'auto' && this.width === 'auto') {
        Object.assign(this.meta, { width, height })
      } else if (this.height === 'auto') {
        this.meta.height = Math.round(getInt(this.width || width) * ratio)
        this.meta.width = getInt(this.width || width)
      } else if (this.width === 'auto') {
        this.meta.width = Math.round(getInt(this.height || height) / ratio)
        this.meta.height = getInt(this.height || height)
      }

      // Generate new src
      const { url } = this.$img(this.src, {
        modifiers: {
          ...this.modifiers,
          width: getInt(this.meta.width || this.width),
          height: getInt(this.meta.height || this.height)
        },
        provider: this.provider,
        preset: this.preset
      })
      this.meta.src = url
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
            ...this.modifiers
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
    const isInherit = this.layout === 'inherit'
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
        width: '100%',
        height: '100%'
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

    const picture = this.lazyState === LazyState.IDLE ? null : h('picture', {
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
      }
    }, [
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

    const ratioSVG = isInherit ? h('svg', {
      attrs: {
        width: this.meta.width,
        height: this.meta.height,
        xmlns: 'http://www.w3.org/2000/svg',
        version: '1.1'
      }
    }) : null
    const ratioBox = h('div', {
      class: '__nim_r',
      attrs: {
        'aria-hidden': 'true'
      },
      style: {
        paddingBottom: isInherit ? undefined : this.imageRatio + '%'
      }
    }, [ratioSVG])

    const wrapper = h('div', {
      class: this.$attrs.class,
      style: {
        position: 'relative',
        overflow: 'hidden',
        display: isInherit ? 'inline-block' : 'block'
      },
      on: {
        click: $event => this.$emit('click', $event)
      }
    }, [placeholder, picture, noScript, ratioBox])

    return wrapper
  }
}
