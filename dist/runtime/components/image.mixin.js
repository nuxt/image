import { parseSize } from "../utils";
const defineMixin = (opts) => opts;
export const imageMixin = defineMixin({
  props: {
    src: { type: String, required: true },
    format: { type: String, default: void 0 },
    quality: { type: [Number, String], default: void 0 },
    background: { type: String, default: void 0 },
    fit: { type: String, default: void 0 },
    modifiers: { type: Object, default: void 0 },
    preset: { type: String, default: void 0 },
    provider: { type: String, default: void 0 },
    sizes: { type: [Object, String], default: void 0 },
    preload: { type: Boolean, default: void 0 },
    width: { type: [String, Number], default: void 0 },
    height: { type: [String, Number], default: void 0 },
    alt: { type: String, default: void 0 },
    referrerpolicy: { type: String, default: void 0 },
    usemap: { type: String, default: void 0 },
    longdesc: { type: String, default: void 0 },
    ismap: { type: Boolean, default: void 0 },
    crossorigin: { type: [Boolean, String], default: void 0, validator: (val) => ["anonymous", "use-credentials", "", true, false].includes(val) },
    loading: { type: String, default: void 0 },
    decoding: { type: String, default: void 0, validator: (val) => ["async", "auto", "sync"].includes(val) }
  },
  computed: {
    nImgAttrs() {
      return {
        width: parseSize(this.width),
        height: parseSize(this.height),
        alt: this.alt,
        referrerpolicy: this.referrerpolicy,
        usemap: this.usemap,
        longdesc: this.longdesc,
        ismap: this.ismap,
        crossorigin: this.crossorigin === true ? "anonymous" : this.crossorigin || void 0,
        loading: this.loading,
        decoding: this.decoding
      };
    },
    nModifiers() {
      return {
        ...this.modifiers,
        width: parseSize(this.width),
        height: parseSize(this.height),
        format: this.format,
        quality: this.quality,
        background: this.background,
        fit: this.fit
      };
    },
    nOptions() {
      return {
        provider: this.provider,
        preset: this.preset
      };
    }
  }
});
