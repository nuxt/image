import { getInt } from '../utils'

export const props = {
  src: {
    type: [String, Object],
    required: true
  },
  provider: {
    type: String,
    required: false
  },
  preset: {
    type: String,
    required: false
  },
  width: {
    type: [String, Number],
    required: false
  },
  height: {
    type: [String, Number],
    required: false
  },
  sizes: {
    type: [String, Array],
    required: false
  },
  format: {
    type: String,
    required: false
  },
  quality: {
    type: [Number, String],
    required: false
  },
  background: {
    type: String,
    required: false
  },
  fit: {
    type: String,
    required: false
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
    required: false
  }
}

// @vue/component
export const NuxtImg = {
  name: 'NuxtImg',
  props,
  data () {
    return {
      meta: {
        src: undefined,
        width: undefined,
        height: undefined
      }
    }
  },
  async fetch () {
    /*
    ** We only set the width or/and height if:
    ** - sizes is not defined
    ** - layout is not "responsive"
    ** - the width or height is "auto" and their values are not percentage
    */
    this.meta.width = undefined
    this.meta.height = undefined
    this.meta.src = undefined
    if (this.sizes || this.layout === 'responsive' || (!this.width && !this.height) || String(this.width).includes('%') || String(this.height).includes('%')) {
      return
    }
    if (this.width !== 'auto' && this.height !== 'auto') {
      const { url } = this.$img(this.src, {
        modifiers: {
          ...this.modifiers,
          width: this.width && getInt(this.width),
          height: this.height && getInt(this.height)
        },
        provider: this.provider,
        preset: this.preset
      })
      this.meta.src = url
      return
    }

    if (process.client) {
      const { url } = this.$img(this.src, {
        modifiers: {
          ...this.modifiers,
          width: this.width === 'auto' ? undefined : this.width && getInt(this.width),
          height: this.height === 'auto' ? undefined : this.height && getInt(this.height)
        },
        provider: this.provider,
        preset: this.preset
      })
      this.meta.src = url
      return
    }

    const { width, height } = await this.$img.getResolution(this.src, {
      provider: this.provider,
      preset: this.preset,
      modifiers: this.modifiers
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
        ...this.modifiers,
        width: getInt(this.meta.width || this.width),
        height: getInt(this.meta.height || this.height)
      },
      provider: this.provider,
      preset: this.preset
    })
    this.meta.src = url
  },
  computed: {
    generatedAlt () {
      return this.alt ? this.alt : this.src.split(/[?#]/).shift().split('/').pop().split('.').shift()
    },
    modifiers () {
      return {
        fit: this.fit,
        quality: this.quality,
        format: this.format,
        background: this.background,
        ...this.operations
      }
    },
    sources () {
      const sizes = this.sizes || ['responsive'].includes(this.layout)
      const image = this.$img.sizes(this.src, sizes, {
        modifiers: this.modifiers,
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
  // TODO: use computed and use only for ratio
  watch: {
    src: '$fetch',
    width: '$fetch',
    height: '$fetch',
    quality: '$fetch',
    fit: '$fetch',
    format: '$fetch',
    background: '$fetch'
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
