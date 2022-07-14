import { h, defineComponent } from 'vue'
import { imgProps, prepareNuxtImg } from './image.shared'
import { useHead } from '#imports'

export default defineComponent({
  name: 'NuxtImg',
  props: imgProps,
  setup: (props, ctx) => {
    const { nSrc, nMainSrc, nAttrs, nPlaceholder, placeholderLoaded } = prepareNuxtImg(props)

    if (props.preload) {
      useHead({
        link: [{ rel: 'preload', as: 'image', href: nSrc.value }]
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
