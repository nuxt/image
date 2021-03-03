import { useObserver } from '~image'

export const EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

// @vue/component
export const lazyMixin = {
  data () {
    return {
      lazyLoad: this.loading === 'lazy'
    }
  },
  mounted () {
    if (this.lazyLoad) {
      this.observe()
    }
  },
  beforeDestroy () {
    this.unobserve()
  },
  methods: {
    observe () {
      this._removeObserver = useObserver(this.$el, () => {
        this.lazyLoad = false
      })
    },
    unobserve () {
      if (this._removeObserver) {
        this._removeObserver()
        delete this._removeObserver
      }
    }
  }
}
