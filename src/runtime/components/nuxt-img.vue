<template>
  <img
    :key="nSrc"
    :src="nSrc"
    v-bind="nAttrs"
  >
</template>

<script lang="ts">
import type { DefineComponentWithMixin } from '../../types/vue'
import type { ImageSizes } from '../../types'
import { imageMixin } from './image.mixin'
import { EMPTY_GIF, lazyMixin } from './lazy.mixin'

import { parseSize } from '~image'

const defineComponent: DefineComponentWithMixin = (opts: any) => opts

type NAttrs = typeof imageMixin['nImgAttrs'] & {
    sizes?: string
    srcset?: string
}

export default defineComponent({
  name: 'NuxtImg',
  mixins: [imageMixin, lazyMixin],
  computed: {
    nAttrs (): NAttrs {
      const attrs: NAttrs = this.nImgAttrs
      if (this.sizes) {
        const { sizes, srcset } = this.nSizes
        attrs.sizes = sizes
        attrs.srcset = srcset
      }
      return attrs
    },
    nSrc (): string {
      // Calculate src first to trigger creation of static image
      const src = this.$img(this.src, this.nModifiers, this.nOptions)
      if (this.lazyLoad) {
        return EMPTY_GIF
      }
      if (this.sizes) {
        return this.nSizes.src
      }
      return src
    },
    /* eslint-disable no-undef */
    nSizes (): ImageSizes {
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
})
</script>
