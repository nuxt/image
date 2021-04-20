<template>
  <img
    :key="nSrc"
    :src="nSrc"
    v-bind="nAttrs"
  >
</template>

<script lang="ts">
import type { DefineComponentWithMixin } from './types'
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
      if (this.lazyLoad) {
        return EMPTY_GIF
      }
      if (this.sizes) {
        return this.nSizes.src
      }
      return this.$img(this.src, this.nModifiers, this.nOptions)
    },
    /* eslint-disable no-undef */
    nSizes (): ReturnType<typeof $Img['getSizes']> {
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
