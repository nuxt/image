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
    legacy: {
      type: Boolean,
      default: false
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
    }
  },
  data () {
    return {
      srcset: [],
      blurry: null,
      loading: false,
      loaded: false,
      imageW: 0,
      imageH: 0
    }
  },
  async fetch () {
    if (this.legacy) {
      return
    }
    const image = await this.$img.lqip(this.src)
    if (!image) {
      return
    }

    this.blurry = image.url
    this.imageW = image.width
    this.imageH = image.height
  },
  mounted () {
    if (!this.legacy) {
      this.$img.$observer.add(this.$el, () => {
        // OK, element is visible, Hoooray
        this.loadOriginalImage()
      })
    }
  },
  computed: {
    imageWidth () {
      return this.width || this.imageW
    },
    imageHeight () {
      return this.height || this.imageH
    },
    imageRatio () {
      if (this.height && this.width) {
        return (parseInt(this.height, 10) / parseInt(this.width, 10)) * 100
      }
      return (this.imageH / this.imageW) * 100
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
    async src () {
      this.blurry = await this.$img.lqip(this.src)
      this.original = null
      if (!this.legacy) {
        this.$img.$observer.remove(this.$el)
        this.$img.$observer.add(this.$el, () => {
        // OK, element is visible, Hoooray
          this.loadOriginalImage()
        })
      }
    }
  },
  methods: {
    generateSizedImage (width: number, height: number, format: string) {
      const image = this.$img(this.src, {
        width,
        height,
        format,
        fit: this.fit,
        ...this.operations
      })
      return encodeURI(image)
    },
    loadOriginalImage () {
      this.loading = true
    },
    renderAttributesToString (attributes = {}) {
      return Object.entries<string>(attributes)
        .map(([key, value]) => value ? `${key}="${value}"` : '')
        .filter(Boolean).join(' ')
    },
    renderImgAttributesToString (extraAttributes = {}) {
      return this.renderAttributesToString({
        ...this.imgAttributes,
        ...extraAttributes
      })
    }
  },
  beforeDestroy () {
    if (!this.legacy) {
      this.$img.$observer.remove(this.$el)
    }
  }
}
