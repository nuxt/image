import nuxtImageMixin from './nuxt-image-mixins'

import './nuxt-image.css'

const pictureHTML = ({ generatedSrc, width, height, alt, sizes }) => 
`<picture>
${sizes.map(s => `<source srcset="${s.url}"${s.type ? ` type="${s.type}"` : '' }${s.media ? ` media="${s.media}"` : '' }>`).join('\n')}
<img class="__nim_org" src="${generatedSrc}" width="${width}" height="${height}" alt="${alt}">
</picture>
`

export default {
    name: "NuxtPicture",
    mixins: [nuxtImageMixin],
    computed: {
        generatedSrc() {
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
    render(h) {
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
                alt: this.alt,
                width: this.width,
                height: this.height,
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
                type: size.type ? size.type : undefined,
                media: size.media ? size.media : undefined
            }
        }))
        const picture = h('picture', {}, [
            ...sources.reverse(),
            originalImage
        ])


        const noScript = h('noscript', {
            domProps: { innerHTML: pictureHTML(this) }
        }, [])

        const placeholder = h('div', {
            class: '__nim_pl',
            style: {
                paddingBottom: this.height ? `${this.height}` : undefined,
            }
        })

        const wrapper = h('div', {
            style: {
                width: this.width ? this.width : undefined
            },
            class: ['__nim_w', this.loaded ? 'visible' : ''],
        }, [bluryImage, picture, noScript, placeholder])

        return wrapper;
    },
    methods: {
        renderLegacy(h) {
            const sources = this.sizes.map(size => h('source', {
                attrs: {
                    srcset: size.url,
                    type: size.type ? size.type : undefined,
                    media: size.media ? size.media : undefined
                }
            }))
            const originalImage = h('img', {
                class: '__nim_org',
                attrs: {
                    src: this.generatedSrc,
                    srcset: this.generatedSrcset,
                    sizes: this.generatedSizes,
                    alt: this.alt
                }
            });
            return h('picture', {}, [
                ...sources.reverse(),
                originalImage
            ])
        },
        isModernFormat({ url, format }) {
            const type = format || url.split('.').pop()
            switch (type) {
                case 'webp':
                    return true;
                default: return false
            }
        }
    }
}