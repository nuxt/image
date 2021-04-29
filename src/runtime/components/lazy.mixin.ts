import type { DefineMixin } from '../../types/vue'
import type { imageMixin } from '../components/image.mixin'

const defineMixin: DefineMixin = (opts: any) => opts

export const EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const supportsLazyLoading = process.client && ('loading' in HTMLImageElement.prototype)

// @vue/component
export const lazyMixin = defineMixin({
  computed: {
    lazyLoad (): boolean {
      return !supportsLazyLoading && (this as any as typeof imageMixin).loading === 'lazy' && !((this.$vnode.elm as any)?.dataset.intersected)
    },
    nDataSrc (): string | null {
      return process.client && !supportsLazyLoading && this.lazyLoad ? (this as any).nSrc : null
    }
  }
})
