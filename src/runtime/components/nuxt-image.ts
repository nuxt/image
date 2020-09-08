import './nuxt-image.css'
import Vue from 'vue'

export default Vue.extend({
    name: "NuxtImage",
    props: {
        src: {
            type: [String, Object],
            default: '',
            required: true
        },
        width: {
            type: Number,
            default: -1
        },
        height: {
            type: Number,
            default: -1
        },
        alt: {
            type: String,
            default: ''
        },
        sets: {
            type: [String, Array],
            default: '',
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
        this.blurry = await this.$img.lqip(this.src)
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
            if (!Array.isArray(sizes) || !sizes.length) {
                sizes = [{
                    width: this.width
                }]
            }
            sizes = sizes.map(size => ({ ...size, url: this.generateSizedImage(size.width) }))
            
            return sizes;
        },
        generatedSrc() {
            return this.sizes[0].url
        },
        generatedSrcset() {
            return this.sizes.map(({ width, url }) => `${url} ${width}w`).join(', ')
        },
        generatedSizes() {
            return this.sizes.map(({ width, breakpoint }) => `${breakpoint}${width}px`).reverse().join(', ')
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
        const bluryImage = h('img', {
            class: '__nuxt-image-blur',
            attrs: {
                src: this.blurry,
                alt: this.alt
            }
        })

        const originalImage = h('img', {
            class: ['__nuxt-image-original', this.loaded ? 'visible' : ''],
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
                innerHTML: `<img class="__nuxt-image-original visible" src="${this.generatedSrc}" srcset="${this.generatedSrcset}" sizes="${this.generatedSizes}" width="${this.width}" height="${this.height}" alt="${this.alt}" >`
            }
        }, [])

        const wrapper = h('div', {
            style: {
                width: `${this.width}px`,
                height: `${this.height}px`,
            },
            class: '__nuxt-image',
        }, [bluryImage, originalImage, noScript])

        return wrapper;
    },
    methods: {
        generateSizedImage(width: number) {
            return this.$img(this.src, {
                width: width
            })
        },
        loadOriginalImage() {
            this.loading = true
        }
    }
})