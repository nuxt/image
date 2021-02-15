// @vue/component
export const imageMixin = {
  props: {
    // input source
    src: { type: String, required: true },

    // modifiers
    format: { type: String, default: undefined },
    quality: { type: [Number, String], default: undefined },
    background: { type: String, default: undefined },
    fit: { type: String, default: undefined },
    modifiers: { type: Object, default: undefined },

    // options
    preset: { type: String, default: undefined },
    provider: { type: String, default: undefined },

    sizes: { type: [Object, String], default: undefined },

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
    decoding: { type: String, default: undefined }
  },
  computed: {
    nImgAttrs () {
      return {
        width: this.width,
        height: this.height,
        alt: this.alt,
        referrerpolicy: this.referrerpolicy,
        usemap: this.usemap,
        longdesc: this.longdesc,
        ismap: this.ismap,
        crossorigin: this.crossorigin,
        loading: this.loading,
        decoding: this.decoding
      }
    },
    nModifiers () {
      return {
        ...this.modifiers,
        width: this.width,
        height: this.height,
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
    }
  }
}
