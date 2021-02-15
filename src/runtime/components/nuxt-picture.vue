<template>
  <picture :key="nSources[0].src">
    <source
      v-if="nSources[1]"
      :type="nSources[1].type"
      :srcset="nSources[1].srcset"
      :sizes="nSources[1].sizes"
    >
    <img
      v-bind="nImgAttrs"
      :src="nSources[0].src"
      :srcset="nSources[0].srcset"
      :sizes="nSources[0].sizes"
    >
  </picture>
</template>

<script lang="ts">
import { imageMixin } from './image.mixin'
import { getFileExtension } from '~image'

export default {
  name: 'NuxtPicture',
  mixins: [imageMixin],

  props: {
    legacyFormat: { type: String, default: undefined }
  },
  computed: {
    isTransparent () {
      return ['png', 'webp', 'gif'].includes(this.originalFormat)
    },
    originalFormat () {
      return getFileExtension(this.src)
    },
    nFormat () {
      if (this.format) {
        return this.format
      }
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
