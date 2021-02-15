<template>
  <img
    :key="nSrc"
    :width="width"
    :height="height"
    :src="nSrc"
    :alt="nAlt"
    v-bind="nAttrs"
  >
</template>

<script lang="ts">
import { generateAlt, useObserver, parseSize } from '~image'

const EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export default {
  name: 'NuxtImg',
  props: {
    // input source
    src: { type: String, required: true },

    // <img> attributes
    width: { type: [String, Number], required: false, default: undefined },
    height: { type: [String, Number], required: false, default: undefined },
    alt: { type: String, required: false, default: undefined },
    loading: { type: String, default: undefined },

    // modifiers
    format: { type: String, required: false, default: undefined },
    quality: { type: [Number, String], required: false, default: undefined },
    background: { type: String, required: false, default: undefined },
    fit: { type: String, required: false, default: undefined },
    modifiers: { type: Object, required: false, default: undefined },

    // options
    preset: { type: String, required: false, default: undefined },
    provider: { type: String, required: false, default: undefined },
    sizes: { type: [Object, String], required: false, default: undefined }
  },
  data () {
    return {
      usePlaceholder: this.loading === 'lazy'
    }
  },
  computed: {
    nAlt () {
      return this.alt ?? generateAlt(this.src)
    },
    nSrc () {
      if (this.usePlaceholder) {
        return EMPTY_GIF
      }
      if (this.sizes) {
        return this.nSizes.src
      }
      return this.$img(this.src, this.nModifiers, this.nOptions)
    },
    nAttrs () {
      const attrs: any = {}
      if (this.sizes) {
        const { sizes, srcset } = this.nSizes
        attrs.sizes = sizes
        attrs.srcset = srcset
      } else if (this.sizes) {
        attrs.sizes = this.sizes
      }
      return attrs
    },
    nSizes () {
      return this.$img.getSizes(this.src, {
        ...this.nOptions,
        sizes: this.sizes,
        modifiers: {
          ...this.nModifiers,
          width: parseSize(this.width),
          height: parseSize(this.height)
        }
      })
    },
    nModifiers () {
      return {
        ...this.modifiers,
        width: this.width,
        height: this.height,
        format: this.format,
        quality: this.quality,
        background: this.background,
        fit: this.fit
      }
    },
    nOptions () {
      return {
        provider: this.provider,
        preset: this.preset
      }
    }
  },
  created () {
    if (process.server && process.static) {
      if (this.sizes) {
        // Force compute sources into ssrContext
        // eslint-disable-next-line no-unused-expressions
        this.nSizes
      }
    }
  },
  mounted () {
    if (this.usePlaceholder) {
      this.observe()
    }
  },
  beforeDestroy () {
    this.unobserve()
  },
  methods: {
    observe () {
      this._removeObserver = useObserver(this.$el, () => {
        this.usePlaceholder = false
      })
    },
    unobserve () {
      if (this._removeObserver) {
        this._removeObserver()
        delete this._removeObserver
      }
    }
  }
}
</script>
