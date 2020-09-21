export default {
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
        if (!this.legacy) {
            this.$img.$observer.add(this.$el, () => {
                // OK, element is visible, Hoooray
                this.loadOriginalImage()
            })
        }
    },
    computed: {
        sizes() {
            let sizes = this.sets;
            if (typeof this.sets === 'string') {
                sizes = this.sets
                    .split(',')
                    .map(set => set.match(/((\d+)\:)?(\d+)\s*(\((\w+)\))?/))
                    .filter(match => !!match)
                    .map((match) => ({
                        width: match[3],
                        breakpoint: match[2],
                        format: match[5] || this.format
                    }))
            }
            if ((!Array.isArray(sizes) || !sizes.length)) {
                sizes = [{
                    width: this.width ? parseInt(this.width, 10) : undefined,
                    height: this.height ? parseInt(this.height, 10) : undefined,
                }]
            }
            sizes = sizes.map(size => ({
                ...size,
                media: size.breakpoint ? `(min-width: ${size.breakpoint}px)` : '',
                format: size.format || this.format,
                url: this.generateSizedImage(size.width, size.height, size.format || this.format)
            }))
            
            return sizes;
        }
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
    methods: {
        generateSizedImage(width: number, height: number, format: string) {
            const image = this.$img(this.src, {
                width,
                height,
                format,
                size: this.size,
                ...this.operations
            })
            return encodeURI(image)
        },
        loadOriginalImage() {
            this.loading = true
        }
    },
    beforeDestroy () {
        this.$img.$observer.remove(this.$el)
    },
}