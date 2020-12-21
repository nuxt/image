import { renderAttributesToString } from './utils'

export enum LazyState {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded'
}

// @vue/component
export default {
  props: {
    src: {
      type: [String, Object],
      default: '',
      required: true
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
      default: undefined
    },
    fit: {
      type: String,
      default: 'cover'
    },
    operations: {
      type: Object,
      default: () => ({})
    },
    noScript: {
      type: Boolean,
      default: false
    },
    // `<img>` attrubutes
    alt: {
      type: String,
      default: undefined
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
    },
    placeholder: {
      type: [Boolean, String],
      default: false
    },
    responsive: {
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
      srcset: [],
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
      const alt = this.alt === undefined ? this.src.split(/[?#]/).shift().split('/').pop().split('.').shift() : this.alt
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
      return this.$img.sizes(this.src, this.sizes || this.responsive, {
        format: this.format,
        ...this.computedOperations
      })
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
      // Fetch meta when necessary
      if (this.placeholder === true || !(this.width && this.height)) {
        try {
          const meta = await this.$img.getMeta(this.src, this.computedOperations)
          Object.assign(this.meta, meta)
        } catch (e) {
          this.onError(e)
          return ''
        }
      }

      // Allow overriding meta.placeholder
      if (typeof this.placeholder === 'string') {
        this.meta.placeholder = this.placeholder
      }
    },
    generateSizedImage (width: number, height: number, format: string) {
      try {
        const image = this.$img(this.src, {
          width,
          height,
          format,
          ...this.computedOperations
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
    renderImgAttributesToString (extraAttributes = {}) {
      return renderAttributesToString({
        ...this.imgAttributes,
        ...extraAttributes
      })
    },
    onError (e: Error) {
      this.error = e.message
      // eslint-disable-next-line no-console
      console.error(e.message)
    },
    // hanlde onLoad event of original image element
    onImageLoaded () {
      this.lazyState = LazyState.LOADED
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
  }
}
