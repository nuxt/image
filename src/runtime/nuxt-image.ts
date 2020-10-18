import nuxtImageMixin from './nuxt-image-mixins'

import './nuxt-image.css'

const imageHTML = ({ generatedSrc, generatedSrcset, generatedSizes, width, height, renderImgAttributesToString }) =>
`<img class="__nim_o" ${renderImgAttributesToString({ src: generatedSrc, srcset: generatedSrcset, sizes: generatedSizes, width, height })} >`

export default {
  name: 'NuxtImage',
  mixins: [nuxtImageMixin],
  computed: {
    generatedSrcset () {
      return this.sizes.map(({ width, url }) => width ? `${url} ${width}w` : url).join(', ')
    },
    generatedSizes () {
      return this.sizes.map(({ width, media }) => media ? `${media} ${width}px` : `${width}px`).reverse().join(', ')
    },
    generatedSrc () {
      if (this.sizes.length) {
        return this.sizes[0].url
      }
      return this.src
    }
  },
  render (h) {
    if (this.legacy) {
      return this.renderLegacy(h)
    }
    const placeholderImage = h('img', {
      class: '__nim_p',
      attrs: {
        src: this.placeholder,
        alt: this.alt
      }
    })

    const originalImage = h('img', {
      class: ['__nim_o'],
      attrs: {
        src: this.loading ? this.generatedSrc : undefined,
        srcset: this.loading ? this.generatedSrcset : undefined,
        sizes: this.loading ? this.generatedSizes : undefined,
        ...this.imgAttributes
      },
      on: {
        load: () => {
          this.loaded = true
        }
      }
    })

    let noScript = null
    if (this.noScript) {
      noScript = h('noscript', {
        domProps: { innerHTML: imageHTML(this) }
      }, [])
    }

    const ratioBox = h('div', {
      class: '__nim_r',
      style: {
        paddingBottom: this.imageRatio ? `${this.imageRatio}%` : undefined
      }
    })

    const wrapper = h('div', {
      class: ['__nim_w', this.loaded ? 'visible' : ''].concat(this.$attrs.class || '')
    }, [placeholderImage, originalImage, noScript, ratioBox])

    return wrapper
  },
  methods: {
    renderLegacy (h) {
      return h('img', {
        class: '__nim_o',
        attrs: {
          src: this.generatedSrc,
          srcset: this.generatedSrcset,
          sizes: this.generatedSizes,
          alt: this.alt,
          ...this.imgAttributes
        }
      })
    }
  }
}
