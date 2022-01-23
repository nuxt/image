<template>
  <img :key="nSrc" v-bind="nAttrs" ref="img" :src="image" v-on="$listeners">
</template>

<script lang="ts">
import type { DefineComponentWithMixin } from '../../types/vue'
import type { ImageSizes } from '../../types'
import { imageMixin } from './image.mixin'

import { parseSize } from '~image'

const defineComponent: DefineComponentWithMixin = (opts: any) => opts

type NAttrs = typeof imageMixin['nImgAttrs'] & {
    sizes?: string
    srcset?: string
}

export default defineComponent({
  name: 'NuxtImg',
  mixins: [imageMixin],
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
    },
    image (): string {
      return this.placeholder ? this.placeholder : this.nSrc
    }
  },
  mounted () {
    if (this.placeholder) {
      this.image = this.placeholder
      const img = new Image()
      img.src = this.nSrc
      const ref = this
      img.onload = () => {
        ref.$refs.img.src = ref.nSrc
        ref.image = ref.nSrc
      }
    }

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
