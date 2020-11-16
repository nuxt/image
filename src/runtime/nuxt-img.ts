
// @vue/component
export default {
  name: 'NuxtImg',
  props: {
    src: {
      type: [String, Object],
      default: '',
      required: true
    },
    sizes: {
      type: [String, Array],
      default: ''
    },
    format: {
      type: String,
      default: undefined
    },
    quality: {
      type: [Number, String],
      default: 75
    },
    fit: {
      type: String,
      default: 'cover'
    },
    operations: {
      type: Object,
      default: () => ({})
    },
    layout: {
      type: String,
      default: 'inherit'
    },
    // `<img>` attrubutes
    alt: {
      type: String,
      default: ''
    }
  },
  computed: {
    generatedAlt () {
      return this.alt ? this.alt : this.src.split(/[?#]/).shift().split('/').pop().split('.').shift()
    },
    sources () {
      const sizes = this.sizes || ['responsive'].includes(this.layout)
      return this.$img.sizes(this.src, sizes, {
        fit: this.fit,
        quality: this.quality,
        format: this.format,
        ...this.operations
      })
    },
    generatedSrcset () {
      if (!Array.isArray(this.sources) || this.sources.length < 2) {
        return undefined
      }
      return this.sources.map(({ width, url }) => width ? `${url} ${width}w` : url).join(',\n')
    },
    generatedSizes () {
      if (!Array.isArray(this.sources) || this.sources.length < 2) {
        return undefined
      }
      return this.sources.map(({ width, media }) => media ? `${media} ${width}px` : `${width}px`).join(', ')
    },
    generatedSrc () {
      if (this.sources.length) {
        return this.sources[0].url
      }
      return this.src
    },
    generatedStyle () {
      if (this.layout === 'responsive') {
        return {
          maxWidth: '100%',
          minWidth: '100%'
        }
      }
      return {}
    }
  },
  render (h) {
    return h('img', {
      class: 'nuxt-img',
      style: this.generatedStyle,
      attrs: {
        src: this.generatedSrc,
        srcset: this.generatedSrcset,
        sizes: this.generatedSizes,
        alt: this.generatedAlt
      }
    })
  }
}
