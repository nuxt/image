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
    },
    data() {
        return {
            blury: null,
            original: null,
            loaded: false,
        }
    },
    // @ts-ignore
    async fetch() {
        // this.$img[p]
        // <NuxtImage src="cloudinary://..." src="{ path: '', provider: 'xnxx' }">
        this.blury = await this.$img.lqip(this.src)
    },
    mounted() {
        this.$img.$observer.add(this.$el, () => {
            console.log("OK, element is visible, Hoooray");
            // OK, element is visible, Hoooray
            this.loadOriginalImage()
        })
    },
    beforeDestroy () {
        this.$img.$observer.remove(this.$el)
    },
    watch: {
        async src(v) {
            this.blury = await this.$img.lqip(this.src)
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
                src: this.blury,
                alt: this.alt
            }
        })

        let originalImage = null
        if (this.original) {
            originalImage = h('img', {
                class: '__nuxt-image-original',
                attrs: {
                    src: this.original,
                    alt: this.alt
                }
            })
        }

        const transition = h('transition', {
            props: {
                name: 'fade'
            }
        }, [originalImage])

        const wrapper = h('div', {
            style: {
                width: `${this.width}px`,
                height: `${this.height}px`,
            },
            class: '__nuxt-image',
        }, [bluryImage, transition])

        return wrapper;
    },
    methods: {
        generateSourceImage() {
            if (typeof this.src === "object") {
                return this.$img(this.src);
            }
            return this.$img(this.src, {
                resize: `${this.width}x${this.height}`
            })
        },
        loadOriginalImage() {
            var newImg = new Image();
            newImg.onload = () => {
                this.original = newImg.src
                this.loaded = true
            }
            newImg.src = this.generateSourceImage();
        }
    }
})