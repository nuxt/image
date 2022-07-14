import { h, defineComponent } from 'vue'
import { pictureProps, prepareNuxtPicture } from './image.shared'
import { useHead } from '#imports'

export default defineComponent({
  name: 'NuxtPicture',
  props: pictureProps,
  setup: (props, ctx) => {
    const { nSources, nImgAttrs } = prepareNuxtPicture(props)

    if (props.preload) {
      const srcKey = nSources.value?.[1] ? 1 : 0

      const link: any = { rel: 'preload', as: 'image', imagesrcset: nSources.value[srcKey].srcset }

      if (nSources.value?.[srcKey]?.sizes) { link.imagesizes = nSources.value[srcKey].sizes }

      useHead({ link: [link] })
    }

    return () => h('picture', { key: nSources.value[0].src }, [
      ...(nSources.value?.[1] && [h('source', {
        type: nSources.value[1].type,
        sizes: nSources.value[1].sizes,
        srcset: nSources.value[1].srcset
      })]),
      h('img', {
        ...nImgAttrs.value,
        ...props.imgAttrs,
        ...ctx.attrs,
        src: nSources.value[0].src,
        sizes: nSources.value[0].sizes,
        srcset: nSources.value[0].srcset
      })
    ])
  }
})
