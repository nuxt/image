<template>
  <img
    :key="nSrc"
    :src="nSrc"
    v-bind="nAttrs"
  >
</template>

<script lang="ts">
import { imageMixin } from './image.mixin'
import { EMPTY_GIF, lazyMixin } from './lazy.mixin'

import { parseSize } from '~image'

export default {
  name: 'NuxtImg',
  mixins: [imageMixin, lazyMixin],
  computed: {
    nAttrs () {
      const attrs: any = this.nImgAttrs
      if (this.sizes) {
        const { sizes, srcset } = this.nSizes
        attrs.sizes = sizes
        attrs.srcset = srcset
      }
      return attrs
    },
    nSrc () {
      if (this.lazyLoad) {
        return EMPTY_GIF
      }
      if (this.sizes) {
        return this.nSizes.src
      }
      return this.$img(this.src, this.nModifiers, this.nOptions)
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
  }
}
</script>
