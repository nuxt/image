import nuxtImageMixin from './nuxt-image-mixins'

import './nuxt-image.css'

const imageHTML = ({ generatedSrc, generatedSrcset, generatedSizes, width, height, renderImgAttributesToString }) =>
`<img class="__nim_org" ${renderImgAttributesToString({ src: generatedSrc, srcset: generatedSrcset, sizes: generatedSizes, width, height })} >`

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
    const bluryImage = h('img', {
      class: '__nim_full __nim_blur',
      attrs: {
        src: this.blurry,
        alt: this.alt
      }
    })

    const originalImage = h('img', {
      class: ['__nim_org'],
      attrs: {
        src: this.loading ? this.generatedSrc : undefined,
        srcset: this.loading ? this.generatedSrcset : undefined,
        sizes: this.loading ? this.generatedSizes : undefined,
        width: this.width,
        height: this.height,
        ...this.imgAttributes
      },
      on: {
        load: () => {
          this.loaded = true
        }
      }
    })

    const noScript = h('noscript', {
      domProps: { innerHTML: imageHTML(this) }
    }, [])

    const placeholder = h('div', {
      class: '__nim_pl',
      style: {
        paddingBottom: this.height ? `${parseInt(this.height, 10)}px` : undefined
      }
    })

    const wrapper = h('div', {
      style: {
        width: this.width ? `${parseInt(this.width, 10)}px` : undefined
      },
      class: ['__nim_w', this.loaded ? 'visible' : ''].concat(this.$attrs.class || '')
    }, [bluryImage, originalImage, noScript, placeholder])

    return wrapper
  },
  methods: {
    renderLegacy (h) {
      return h('img', {
        class: '',
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
