<template>
  <img :width="width" :height="height" :src="nSrc" :alt="nAlt">
</template>

<script>
import { generateAlt } from '~image'

export default {
  name: 'NuxtImg',
  props: {
    // input source
    src: { type: String, required: true },

    // <img> attributes
    width: { type: [String, Number], required: false, default: undefined },
    height: { type: [String, Number], required: false, default: undefined },
    alt: { type: String, required: false, default: undefined },

    // modifiers
    format: { type: String, required: false, default: undefined },
    quality: { type: [Number, String], required: false, default: undefined },
    background: { type: String, required: false, default: undefined },
    fit: { type: String, required: false, default: undefined },

    // options
    preset: { type: String, required: false, default: undefined },
    provider: { type: String, required: false, default: undefined }
  },
  computed: {
    nAlt () {
      return this.alt ?? generateAlt(this.src)
    },
    nSrc () {
      return this.$img(this?.src, {
        provider: this.provider,
        preset: this.preset,
        modifiers: this.modifiers
      }).url
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
  }
}

</script>
