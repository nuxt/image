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
      default: typeof IntersectionObserver !== 'undefined'
    },
    sets: {
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
    },
    placeholder: {
      type: [Boolean, String],
      default: false
    }
  },
  async fetch () {
    await this.fetchMeta()
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
      lazyState: LazyState.IDLE
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
        return (this.meta.width / this.meta.height) * 100
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
    sizes () {
      let sizes = this.sets
      if (typeof this.sets === 'string') {
        sizes = this.sets
          .split(',')
          .map(set => set.match(/((\d+):)?(\d+)\s*(\((\w+)\))?/)) // match: 100:100 (webp)
          .filter(match => !!match)
          .map((match, index) => ({
            width: match[3],
            breakpoint: match[2] || (index > 0 && match[3]),
            format: match[5] || this.format
          }))
      }
      if ((!Array.isArray(sizes) || !sizes.length)) {
        sizes = [{
          width: this.width ? parseInt(this.width, 10) : undefined,
          height: this.height ? parseInt(this.height, 10) : undefined
        }]
      }

      sizes = sizes.map((size) => {
        if (!size.format) {
          size.format = this.format
        }
        if (!size.media) {
          size.media = size.breakpoint ? `(min-width: ${size.breakpoint}px)` : ''
        }
        size.url = this.generateSizedImage(size.width, size.height, size.format)
        return size
      })

      return sizes
    }
  },
  watch: {
    src () {
      this.fetchMeta()

      if (this.lazy) {
        this.$img.$observer.remove(this.$el)
        this.$img.$observer.add(this.$el, () => {
          // OK, element is visible, Hoooray
          this.loadOriginalImage()
        })
      }
    }
  },
  mounted () {
    if (this.lazy) {
      this.$img.$observer.add(this.$el, () => {
        // OK, element is visible, Hoooray
        this.loadOriginalImage()
      })
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
        return encodeURI(image)
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
    }
  }
}
