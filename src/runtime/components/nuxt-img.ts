import type { Component } from 'vue'
import { generateAlt } from '../utils'

export const props = {
  // input source
  src: { type: String, required: true },

  // <img> attributes
  width: { type: [String, Number], required: false },
  height: { type: [String, Number], required: false },
  alt: { type: String, required: false },

  // modifiers
  format: { type: String, required: false },
  quality: { type: [Number, String], required: false },
  background: { type: String, required: false },
  fit: { type: String, required: false },

  // options
  preset: { type: String, required: false },
  provider: { type: String, required: false }
}

// @vue/component
export const NuxtImg: Component = {
  name: 'NuxtImg',
  props,
  computed: {
    nAlt () {
      return this.alt ?? generateAlt(this.src)
    },
    nModifiers () {
      return {
        width: this.width,
        height: this.height,
        format: this.format,
        quality: this.quality,
        background: this.background,
        fit: this.fit
      }
    },
    nSrc () {
      return this.$img(this?.src, {
        provider: this.provider,
        preset: this.preset,
        modifiers: this.nModifiers
      }).url
    }
  },
  render (h) {
    return h('img', {
      attrs: {
        width: this.width,
        height: this.height,
        src: this.nSrc,
        alt: this.nAlt
      }
    })
  }
}
