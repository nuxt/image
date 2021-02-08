<template>
  <div class="wrapper__responsive">
    <div class="sizer__responsive" :style="{ paddingTop: sizerHeight }" />
    <img
      v-if="placeholder"
      aria-hidden="true"
      class="placeholder"
      :src="placeholderSrc"
      :style="{ opacity: isLoaded ? 0 : 1 }"
    >
    <picture v-if="isVisible">
      <source
        v-for="nSource of nSources"
        :key="nSource.src"
        :type="nSource.type"
        :srcset="nSource.srcset"
        :sizes="nSource.sizes"
      >
      <img
        v-if="isVisible"
        class="img"
        decoding="async"
        :alt="nAlt"
        :referrerpolicy="referrerpolicy"
        :usemap="usemap"
        :longdesc="longdesc"
        :ismap="ismap"
        :crossorigin="crossorigin"
        :src="nSources[0].src"
        :srcset="nSources[0].srcset"
        :sizes="nSources[0].sizes"
        :style="{ opacity: isLoaded ? 1 : 0.01 }"
        :loading="isLazy ? 'lazy' : 'eager'"
        @load="onImageLoaded"
        @onbeforeprint="onPrint"
      >
    </picture>
  </div>
</template>

<script lang="ts">
import { generateAlt, getFileExtension, useObserver, parseSize } from '~image'

export const LazyState = {
  IDLE: 'idle',
  LOADING: 'loading',
  LOADED: 'loaded'
}

export default {
  name: 'NuxtPicture',
  props: {
    // input source
    src: { type: String, required: true },

    // <img> attributes
    width: { type: [String, Number], required: false, default: undefined },
    height: { type: [String, Number], required: false, default: undefined },
    alt: { type: String, required: false, default: undefined },
    referrerpolicy: { type: String, default: undefined },
    usemap: { type: String, default: undefined },
    longdesc: { type: String, default: undefined },
    ismap: { type: Boolean, default: false },
    crossorigin: { type: Boolean, default: false },
    loading: { type: String, default: 'lazy' },

    // modifiers
    format: { type: String, required: false, default: undefined },
    legacyFormat: { type: String, required: false, default: undefined },
    quality: { type: [Number, String], required: false, default: undefined },
    background: { type: String, required: false, default: undefined },
    fit: { type: String, required: false, default: undefined },
    modifiers: { type: Object, required: false, default: undefined },

    // options
    preset: { type: String, required: false, default: undefined },
    provider: { type: String, required: false, default: undefined },

    // extras
    placeholder: { type: [Boolean, String], default: false },
    sizes: { type: Object, required: false, default: undefined }
  },
  data () {
    const isLazy = this.loading === 'lazy'
    return {
      isLazy,
      lazyState: isLazy ? LazyState.IDLE : LazyState.LOADED
    }
  },
  computed: {
    ratio () {
      return this.nHeight / this.nWidth
    },
    isVisible () {
      if (this.lazyState === LazyState.IDLE) {
        return false
      }
      return true
    },
    isLoaded () {
      return this.lazyState === LazyState.LOADED
    },
    nAlt () {
      return this.alt ?? generateAlt(this.src)
    },
    nWidth () {
      return parseSize(this.width)
    },
    nHeight () {
      return parseSize(this.height)
    },
    isTransparent () {
      return ['png', 'webp', 'gif'].includes(this.originalFormat)
    },
    originalFormat () {
      return getFileExtension(this.src)
    },
    nFormat () {
      if (this.format) { return this.format }
      if (this.originalFormat === 'svg') { return 'svg' }
      return 'webp'
    },
    nLegacyFormat () {
      if (this.legacyFormat) {
        return this.legacyFormat
      }
      const formats = {
        webp: this.isTransparent ? 'png' : 'jpeg',
        svg: 'png'
      }
      return formats[this.nFormat] || this.originalFormat
    },
    nModifiers () {
      return {
        ...this.modifiers,
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
    },
    nSources () {
      if (this.nFormat === 'svg') {
        return [{
          srcset: this.src
        }]
      }

      const formats = this.nLegacyFormat !== this.nFormat
        ? [this.nLegacyFormat, this.nFormat]
        : [this.nFormat]

      const sources = formats.map((format) => {
        const { srcset, sizes, src } = this.$img.getSizes(this.src, {
          ...this.nOptions,
          sizes: this.sizes,
          modifiers: {
            ...this.nModifiers,
            width: this.nWidth,
            height: this.nHeight,
            format
          }
        })

        return {
          src,
          type: `image/${format}`,
          sizes,
          srcset
        }
      })

      return sources
    },
    srcset () {
      if (this.nFormat === 'svg') {
        return
      }
      return this.sources.map(source => `${source.srcset} ${source.width}w`)
    },
    placeholderSrc () {
      if (!this.placeholder) {
        return
      }
      // Custom placeholder src
      if (typeof this.placeholder === 'string') {
        return this.placeholder
      }
      const width = 30
      return this.$img(this.src, {
        ...this.nModifiers,
        width,
        height: this.ratio ? Math.round(width * this.ratio) : undefined
      }, this.nOptions)
    },
    sizerHeight () {
      return this.ratio ? `${this.ratio * 100}%` : '100%'
    }
  },
  created () {
    if (process.server && process.static) {
      // Force compute sources into ssrContext
      // eslint-disable-next-line no-unused-expressions
      this.nSources
    }
  },
  mounted () {
    if (this.isLazy) {
      this.observe()
    }
  },
  beforeDestroy () {
    this.unobserve()
  },
  methods: {
    observe () {
      this._removeObserver = useObserver(this.$el, type => this.onObservered(type))
    },
    unobserve () {
      if (this._removeObserver) {
        this._removeObserver()
        delete this._removeObserver
      }
    },
    onImageLoaded (event) {
      this.$emit('load', event)
      if (this.lazyState !== LazyState.LOADED) {
        this.lazyState = LazyState.LOADED
      }
    },
    onObservered (type) {
      if (type === 'print') {
        return this.onPrint()
      }
      this.lazyState = LazyState.LOADING
    },
    onPrint () {
      this.lazyState = LazyState.LOADED
      this.unobserve()
    }
  }
}
</script>

<style scoped>
.img {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 0px;
  height: 0px;
  box-sizing: border-box;
  border: none;
  margin: auto;
  inset: 0px;
  display: block;
  padding: 0;
  min-width: 100%;
  max-width: 100%;
  min-height: 100%;
  max-height: 100%;
  transition: opacity 500ms ease 0s;
  object-fit: cover;
  object-position: center center;
}
.placeholder {
  position: absolute;
  left: 0;
  top: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  filter: blur(10px);
  transition-delay: 500ms;
}

.wrapper__responsive {
  display: block;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  margin: 0;
}

.sizer__responsive {
  display: block;
  box-sizing: border-box;
}
</style>
