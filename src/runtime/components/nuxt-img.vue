<template>
  <img
    :width="width"
    :height="height"
    :src="nSrc"
    :alt="nAlt"
    v-bind="nAttrs"
  >
</template>

<script lang="ts">
import { generateAlt, useObserver } from '~image'

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

    // options
    preset: { type: String, required: false, default: undefined },
    provider: { type: String, required: false, default: undefined },
    responsive: { type: Boolean, required: false, default: false }
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
      return this.$img(this.src, {
        provider: this.provider,
        preset: this.preset,
        modifiers: this.modifiers
      }).url
    },
    nAttrs () {
      const attrs: any = {}
      if (this.responsive) {
        const sizes = this.$img.getSizes(this.src, {
          sizes: this.sizes,
          width: this.nWidth,
          height: this.nHeight,
          modifiers: this.modifiers
        })
        attrs.sizes = sizes.map(({ width }) => `(max-width: ${width}px) ${width}px`)
        attrs.srcSet = sizes.map(({ width, src }) => `${src} ${width}w`)
      }
      return attrs
    },
    modifiers () {
      return {
        width: this.width,
        height: this.height,
        format: this.format,
        quality: this.quality,
        background: this.background,
        fit: this.fit
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
