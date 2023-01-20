<template>
  <picture :key="nSources[0].src">
    <source
      v-if="nSources[1]"
      :type="nSources[1].type"
      :srcset="nSources[1].srcset"
      :sizes="nSources[1].sizes"
    >
    <img
      v-bind="{...nImgAttrs, ...imgAttrs}"
      :src="nSources[0].src"
      :srcset="nSources[0].srcset"
      :sizes="nSources[0].sizes"
      v-on="$listeners"
    >
  </picture>
</template>

<script>
import { imageMixin } from "./image.mixin";
import { getFileExtension } from "~image";
const defineComponent = (opts) => opts;
export default defineComponent({
  name: "NuxtPicture",
  mixins: [imageMixin],
  props: {
    legacyFormat: { type: String, default: null },
    imgAttrs: { type: Object, default: null }
  },
  head() {
    if (this.preload === true) {
      const srcKey = typeof this.nSources[1] !== "undefined" ? 1 : 0;
      const link = {
        rel: "preload",
        as: "image",
        imagesrcset: this.nSources[srcKey].srcset
      };
      if (typeof this.nSources[srcKey].sizes !== "undefined") {
        link.imagesizes = this.nSources[srcKey].sizes;
      }
      return {
        link: [link]
      };
    }
    return {};
  },
  computed: {
    isTransparent() {
      return ["png", "webp", "gif"].includes(this.originalFormat);
    },
    originalFormat() {
      return getFileExtension(this.src);
    },
    nFormat() {
      if (this.format) {
        return this.format;
      }
      if (this.originalFormat === "svg") {
        return "svg";
      }
      return "webp";
    },
    nLegacyFormat() {
      if (this.legacyFormat) {
        return this.legacyFormat;
      }
      const formats = {
        webp: this.isTransparent ? "png" : "jpeg",
        svg: "png"
      };
      return formats[this.nFormat] || this.originalFormat;
    },
    nSources() {
      if (this.nFormat === "svg") {
        return [{
          srcset: this.src
        }];
      }
      const formats = this.nLegacyFormat !== this.nFormat ? [this.nLegacyFormat, this.nFormat] : [this.nFormat];
      const sources = formats.map((format) => {
        const { srcset, sizes, src } = this.$img.getSizes(this.src, {
          ...this.nOptions,
          sizes: this.sizes || this.$img.options.screens,
          modifiers: {
            ...this.nModifiers,
            format
          }
        });
        return {
          src,
          type: `image/${format}`,
          sizes,
          srcset
        };
      });
      return sources;
    }
  },
  created() {
    if (process.server && process.static) {
      this.nSources;
    }
  }
});
</script>
