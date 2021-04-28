import type { DefineMixin } from '../../types/vue'
import type { imageMixin } from './image.mixin'

import { useObserver } from '~image'

export const EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const defineMixin: DefineMixin = (opts: any) => opts

interface PrivateThis {
  _removeObserver?: ReturnType<typeof useObserver>
}

const supportsLazyLoading = process.client && ('loading' in HTMLImageElement.prototype)

// @vue/component
export const lazyMixin = defineMixin({
  data () {
    return {
      lazyLoad: (this as any as typeof imageMixin).loading === 'lazy' && !supportsLazyLoading
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
      ;(this as PrivateThis)._removeObserver = useObserver(this.$el, () => {
        this.lazyLoad = false
      })
    },
    unobserve () {
      const { _removeObserver } = this as PrivateThis
      if (_removeObserver) {
        _removeObserver()
        delete (this as PrivateThis)._removeObserver
      }
    }
  }
})
