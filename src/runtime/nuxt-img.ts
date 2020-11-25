import { getInt } from './utils'

export const props = {
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
  sizes: {
    type: [String, Array],
    default: ''
  },
  format: {
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
  layout: {
    type: String,
    default: 'inherit'
  },
  // `<img>` attributes
  alt: {
    type: String,
    default: ''
  }
}

// @vue/component
export default {
  name: 'NuxtImg',
  props,
  async fetch () {
    /*
    ** We only set the width or/and height if:
    ** - sizes is not defined
    ** - layout is not "responsive"
    ** - the width or height is "auto" and their values are not percentage
    */
    if (this.sizes || this.layout === 'responsive' || (!this.width && !this.height) || this.width.includes('%') || this.height.includes('%')) {
      this.meta.width = undefined
      this.meta.height = undefined
      this.meta.src = undefined
      return
    }
    if (this.width !== 'auto' && this.height !== 'auto') {
      const { url } = this.$img(this.src, {
        modifiers: {
          width: this.width && getInt(this.width),
          height: this.height && getInt(this.height)
        },
        provider: this.provider,
        preset: this.preset
      })
      this.meta.src = url
      return
    }

    // Get original image width & height
    // TODO:
    // const { width, height } = await this.$img.getResolution(this.src, {
    //   provider: this.provider,
    //   preset: this.preset
    // })
    const { width, height } = await this.$img.getMeta(this.src, {
      provider: this.provider,
      preset: this.preset
    })
    const ratio = height / width

    if (this.height === 'auto' && this.width === 'auto') {
      Object.assign(this.meta, { width, height })
    } else if (this.height === 'auto') {
      this.meta.height = Math.round(getInt(this.width || width) * ratio)
      this.meta.width = undefined
    } else if (this.width === 'auto') {
      this.meta.width = Math.round(getInt(this.height || height) / ratio)
      this.meta.height = undefined
    }
    // Generate new src
    const { url } = this.$img(this.src, {
      modifiers: {
        width: getInt(this.meta.width || this.width),
        height: getInt(this.meta.height || this.height)
      },
      provider: this.provider,
      preset: this.preset
    })
    this.meta.src = url
  },
  data () {
    return {
      meta: {
        src: undefined,
        width: undefined,
        height: undefined
      }
    }
  },
  computed: {
    generatedAlt () {
      return this.alt ? this.alt : this.src.split(/[?#]/).shift().split('/').pop().split('.').shift()
    },
    sources () {
      const sizes = this.sizes || ['responsive'].includes(this.layout)
      const image = this.$img.sizes(this.src, sizes, {
        modifiers: {
          fit: this.fit,
          quality: this.quality,
          format: this.format,
          ...this.operations
        },
        provider: this.provider,
        preset: this.preset
      })
      return image
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
      if (this.meta.src) {
        return this.meta.src
      }
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
  watch: {
    src: '$fetch',
    width: '$fetch',
    height: '$fetch'
  },
  render (h) {
    return h('img', {
      class: 'nuxt-img',
      style: this.generatedStyle,
      attrs: {
        width: this.meta.width || this.width,
        height: this.meta.height || this.height,
        src: this.generatedSrc,
        srcset: this.generatedSrcset,
        sizes: this.generatedSizes,
        alt: this.generatedAlt
      }
    })
  }
}
