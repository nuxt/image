import './nuxt-image.css'

export default {
    name: "NuxtImage",
    props: {
        src: {
            type: [String, Object],
            default: '',
            required: true
        },
        width: {
            type: String,
            default: ''
        },
        height: {
            type: String,
            default: ''
        },
        legacy: {
            type: Boolean,
            default: false
        },
        alt: {
            type: String,
            default: ''
        },
        sets: {
            type: [String, Array],
            default: '',
        },
        format: {
            type: String,
            default: undefined
        },
        size: {
            type: String,
            default: 'cover'
        },
        operations: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            srcset: [],
            blurry: null,
            loading: false,
            loaded: false,
        }
    },
    async fetch() {
        if (!this.legacy) {
            this.blurry = await this.$img.lqip(this.src)
        }
    },
    mounted() {
        this.$img.$observer.add(this.$el, () => {
            // OK, element is visible, Hoooray
            this.loadOriginalImage()
        })
    },
    computed: {
        sizes() {
            let sizes = this.sets;
            if (typeof this.sets === 'string') {
                sizes = this.sets.split(',').filter(Boolean).map((set) => {
                    let [breakpoint, width] = set.split(':').map(num => parseInt(num.trim(), 10))
                    return width ? {
                        breakpoint: `(min-width:${breakpoint}px) `,
                        width: width,
                    } : {
                        breakpoint: '',
                        width: breakpoint
                    }
                })
            }
            if ((!Array.isArray(sizes) || !sizes.length)) {
                sizes = [{
                    breakpoint: '',
                    width: this.width ? parseInt(this.width, 10) : undefined,
                    height: this.height ? parseInt(this.height, 10) : undefined,
                }]
            }
            sizes = sizes.map(size => ({ ...size, url: this.generateSizedImage(size.width, size.height) }))
            
            return sizes;
        },
        generatedSrc() {
            if (this.sizes.length) {
                return this.sizes[0].url
            }
            return this.src
        },
        generatedSrcset() {
            return this.sizes.map(({ width, url }) => width ? `${url} ${width}w` : url).join(', ')
        },
        generatedSizes() {
            return this.sizes.map(({ width, breakpoint }) => width ? `${breakpoint}${width}` : breakpoint).reverse().join(', ')
        }
    },
    beforeDestroy () {
        this.$img.$observer.remove(this.$el)
    },
    watch: {
        async src(v) {
            this.blurry = await this.$img.lqip(this.src)
            this.original = null
            this.$img.$observer.remove(this.$el)
            this.$img.$observer.add(this.$el, () => {
                // OK, element is visible, Hoooray
                this.loadOriginalImage()
            })
        }
    },
    render(h) {
        if (this.legacy) {
            return this.renderNonOptimizedImage(h)
        }
        const bluryImage = h('img', {
            class: '__nuxt-image-rel full blur',
            attrs: {
                src: this.blurry,
                alt: this.alt
            }
        })

        const originalImage = h('img', {
            class: ['__nuxt-image-abs'],
            attrs: {
                src: this.loading ? this.generatedSrc : undefined,
                srcset: this.loading ? this.generatedSrcset : undefined,
                sizes: this.loading ? this.generatedSizes : undefined,
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


        const noScript = h('noscript', {
            domProps: {
                innerHTML: `<img class="__nuxt-image-abs visible" src="${this.generatedSrc}" srcset="${this.generatedSrcset}" sizes="${this.generatedSizes}" width="${this.width}" height="${this.height}" alt="${this.alt}" >`
            }
        }, [])

        const placeholder = h('div', {
            class: '___nuxt-image-pl',
            style: {
                paddingBottom: this.height ? `${this.height}` : undefined,
            }
        })

        const wrapper = h('div', {
            style: {
                width: this.width ? this.width : undefined
            },
            class: ['__nuxt-image', this.loaded ? 'visible' : ''],
        }, [bluryImage, originalImage, noScript, placeholder])

        return wrapper;
    },
    methods: {
        renderNonOptimizedImage(h) {
            return h('img', {
                class: '',
                attrs: {
                    src: this.generatedSrc,
                    srcset: this.generatedSrcset,
                    sizes: this.generatedSizes,
                    alt: this.alt
                }
            })
        },
        generateSizedImage(width: number, height: number) {
            const image = this.$img(this.src, {
                width,
                height,
                format: this.format,
                size: this.size,
                ...this.operations
            })
            return encodeURI(image)
        },
        loadOriginalImage() {
            this.loading = true
        }
    }
}