<template>
  <img :key="nSrc" v-bind="nAttrs" ref="img" :src="nSrc" v-on="$listeners">
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
  props: {
    placeholder: { type: [Boolean, String, Number, Array], default: undefined }
  },
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
    nMainSrc (): string {
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
    nSrc (): string {
      return this.nPlaceholder ? this.nPlaceholder : this.nMainSrc
    },
    nPlaceholder () {
      let placeholder = this.placeholder
      if (placeholder === '') { placeholder = true }
      if (!placeholder || this.placeholderLoaded) { return false }
      if (typeof placeholder === 'string') { return placeholder }
      const size = (Array.isArray(placeholder)
        ? placeholder
        : (typeof placeholder === 'number' ? [placeholder, placeholder] : [10, 10])) as [w: number, h: number, q: number]
      return this.$img(this.src, {
        ...this.nModifiers,
        width: size[0],
        height: size[1],
        quality: size[2] || 50
      }, this.nOptions)
    }
  },
  mounted () {
    if (this.nPlaceholder) {
      const img = new Image()
      img.src = this.nMainSrc
      img.onload = () => {
        // @ts-ignore
        this.$refs.img.src = this.nMainSrc
        this.placeholderLoaded = true
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
