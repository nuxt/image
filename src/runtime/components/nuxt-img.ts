import { h, defineComponent } from 'vue'
import { imgProps, prepareNuxtImg } from './image.shared'
import { useHead } from '#imports'

export default defineComponent({
  name: 'NuxtImg',
  props: imgProps,
  setup: (props, ctx) => {
    const { nSrc, nMainSrc, nSizes, nAttrs, nPlaceholder, placeholderLoaded } = prepareNuxtImg(props)

    if (props.preload) {
      const isResponsive = Object.values(nSizes.value).every(v => v)

      useHead({
        link: [{
          rel: 'preload',
          as: 'image',
          ...(!isResponsive
            ? { href: nSrc.value }
            : {
                href: nSizes.value.src,
                imagesizes: nSizes.value.sizes,
                imagesrcset: nSizes.value.srcset
              })
        }]
      })
    }

    const imgEl = ref<HTMLImageElement>(null)

    onMounted(() => {
      if (nPlaceholder.value) {
        const img = new Image()
        img.src = nMainSrc.value
        img.onload = () => {
          imgEl.value.src = nMainSrc.value
          placeholderLoaded.value = true
        }
      }
    })

    return () => h('img', {
      ref: imgEl,
      key: nSrc.value,
      src: nSrc.value,
      ...nAttrs.value,
      ...ctx.attrs
    })
  }
})
