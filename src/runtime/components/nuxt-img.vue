<template>
  <img :key="nSrc" :src="nSrc" v-bind="{ ...$attrs, nAttrs }">
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { ImageSizes } from '../../types'
import imageMixin from './image'

import { parseSize } from '~image'

type NAttrs = typeof imageMixin['nImgAttrs'] & {
    sizes?: string
    srcset?: string
}

export default defineComponent({
  name: 'NuxtImg',
  extends: imageMixin,
  head () {
    if (this.preload === true) {
      return {
        link: [
          {
            rel: 'preload',
            as: 'image',
            href: this.nSrc
          }
        ]
      }
    }
  },
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
      return this.sizes ? this.nSizes.src : this.$img(this.src, this.nModifiers, this.nOptions)
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
