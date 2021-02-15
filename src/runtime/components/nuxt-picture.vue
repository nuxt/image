<template>
  <picture>
    <source
      v-if="nSources[1]"
      :key="nSources[1].src"
      :type="nSources[1].type"
      :srcset="nSources[1].srcset"
      :sizes="nSources[1].sizes"
    >
    <img
      :alt="nAlt"
      :decoding="decoding"
      :referrerpolicy="referrerpolicy"
      :usemap="usemap"
      :longdesc="longdesc"
      :ismap="ismap"
      :crossorigin="crossorigin"
      :src="nSources[0].src"
      :srcset="nSources[0].srcset"
      :sizes="nSources[0].sizes"
      :loading="loading"
    >
  </picture>
</template>

<script lang="ts">
import { generateAlt, getFileExtension, parseSize } from '~image'

export default {
  name: 'NuxtPicture',
  props: {
    // input source
    src: { type: String, required: true },

    // <img> attributes
    width: { type: [String, Number], default: undefined },
    height: { type: [String, Number], default: undefined },
    alt: { type: String, default: undefined },
    referrerpolicy: { type: String, default: undefined },
    usemap: { type: String, default: undefined },
    longdesc: { type: String, default: undefined },
    ismap: { type: Boolean, default: undefined },
    crossorigin: { type: Boolean, default: undefined },
    loading: { type: String, default: undefined },
    decoding: { type: String, default: undefined },

    // modifiers
    format: { type: String, default: undefined },
    legacyFormat: { type: String, default: undefined },
    quality: { type: [Number, String], default: undefined },
    background: { type: String, default: undefined },
    fit: { type: String, default: undefined },
    modifiers: { type: Object, default: undefined },

    // options
    preset: { type: String, default: undefined },
    provider: { type: String, default: undefined },

    // extras
    sizes: { type: [Object, String], default: undefined }
  },
  computed: {
    ratio () {
      return this.nHeight / this.nWidth
    },
    nAlt () {
      return this.alt ?? generateAlt(this.src)
    },
    nWidth () {
      return parseSize(this.width)
    },
    nHeight () {
      return parseSize(this.height)
    },
    isTransparent () {
      return ['png', 'webp', 'gif'].includes(this.originalFormat)
    },
    originalFormat () {
      return getFileExtension(this.src)
    },
    nFormat () {
      if (this.format) { return this.format }
      if (this.originalFormat === 'svg') { return 'svg' }
      return 'webp'
    },
    nLegacyFormat () {
      if (this.legacyFormat) {
        return this.legacyFormat
      }
      const formats = {
        webp: this.isTransparent ? 'png' : 'jpeg',
        svg: 'png'
      }
      return formats[this.nFormat] || this.originalFormat
    },
    nModifiers () {
      return {
        ...this.modifiers,
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
    },
    nSources () {
      if (this.nFormat === 'svg') {
        return [{
          srcset: this.src
        }]
      }

      const formats = this.nLegacyFormat !== this.nFormat
        ? [this.nLegacyFormat, this.nFormat]
        : [this.nFormat]

      const sources = formats.map((format) => {
        const { srcset, sizes, src } = this.$img.getSizes(this.src, {
          ...this.nOptions,
          sizes: this.sizes || this.$img.options.screens,
          modifiers: {
            ...this.nModifiers,
            width: this.nWidth,
            height: this.nHeight,
            format
          }
        })

        return {
          src,
          type: `image/${format}`,
          sizes,
          srcset
        }
      })

      return sources
    },
    srcset () {
      if (this.nFormat === 'svg') {
        return
      }
      return this.sources.map(source => `${source.srcset} ${source.width}`)
    }
  },
  created () {
    if (process.server && process.static) {
      // Force compute sources into ssrContext
      // eslint-disable-next-line no-unused-expressions
      this.nSources
    }
  }
}
</script>
