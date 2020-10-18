import nuxtImageMixin from './nuxt-image-mixins'

import './nuxt-image.css'

const pictureHTML = ({ generatedSrc, width, height, renderImgAttributesToString, sizes, renderAttributesToString }) =>
`<picture>
${sizes.map(s => `<source ${renderAttributesToString({ type: s.format, media: s.media, srcset: s.url })}>`).join('\n')}
<img class="__nim_o" ${renderImgAttributesToString({ src: generatedSrc, width, height })}>
</picture>
`

export default {
  name: 'NuxtPicture',
  mixins: [nuxtImageMixin],
  computed: {
    generatedSrc () {
      const [size] = this.sizes
      if (size) {
        if (this.isModernFormat(size)) {
          return this.generateSizedImage(size.width, size.height, 'jpeg')
        } else {
          return this.sizes[0].url
        }
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
        ...this.imgAttributes
      },
      on: {
        load: () => {
          this.loaded = true
        }
      }
    })
    const sources = this.sizes.map(size => h('source', {
      attrs: {
        srcset: size.url,
        type: size.format ? size.format : undefined,
        media: size.media ? size.media : undefined
      }
    }))
    const picture = h('picture', {}, [
      ...sources.reverse(),
      originalImage
    ])

    let noScript = null
    if (this.noScript) {
      noScript = h('noscript', {
        domProps: { innerHTML: pictureHTML(this) }
      }, [])
    }

    const ratioBox = h('div', {
      class: '__nim_r',
      style: {
        paddingBottom: this.imageRatio ? `${this.imageRatio}%` : undefined
      }
    })

    const wrapper = h('div', {
      class: ['__nim_w', this.loaded ? 'visible' : '']
    }, [placeholderImage, picture, noScript, ratioBox])

    return wrapper
  },
  methods: {
    renderLegacy (h) {
      const sources = this.sizes.map(size => h('source', {
        attrs: {
          srcset: size.url,
          type: size.format ? size.format : undefined,
          media: size.media ? size.media : undefined
        }
      }))
      const originalImage = h('img', {
        class: '__nim_o',
        attrs: {
          src: this.generatedSrc,
          srcset: this.generatedSrcset,
          sizes: this.generatedSizes,
          ...this.imgAttributes
        }
      })
      return h('picture', {}, [
        ...sources.reverse(),
        originalImage
      ])
    },
    isModernFormat ({ url, format }) {
      const type = format || url.split('.').pop()
      switch (type) {
        case 'webp':
          return true
        default: return false
      }
    }
  }
}
