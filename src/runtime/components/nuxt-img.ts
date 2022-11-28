import { h, defineComponent, ref, computed, onMounted } from 'vue'
import { appendHeader } from 'h3'
import { useImage } from '../composables'
import { parseSize } from '../utils'
import { baseImageProps, useBaseImage } from './_base'
import { useHead, useRequestEvent } from '#imports'

export const imgProps = {
  ...baseImageProps,
  placeholder: { type: [Boolean, String, Number, Array], default: undefined }
}

export default defineComponent({
  name: 'NuxtImg',
  props: imgProps,
  setup: (props, ctx) => {
    const $img = useImage()
    const _base = useBaseImage(props)

    const placeholderLoaded = ref(false)

    type AttrsT = typeof _base.attrs.value & {
      sizes?: string
      srcset?: string
    }

    const sizes = computed(() => $img.getSizes(props.src, {
      ..._base.options.value,
      sizes: props.sizes,
      modifiers: {
        ..._base.modifiers.value,
        width: parseSize(props.width),
        height: parseSize(props.height)
      }
    }))

    const attrs = computed(() => {
      const attrs: AttrsT = _base.attrs.value
      if (props.sizes) {
        attrs.sizes = sizes.value.sizes
        attrs.srcset = sizes.value.srcset
      }
      return attrs
    })

    const placeholder = computed(() => {
      let placeholder = props.placeholder
      if (placeholder === '') { placeholder = true }
      if (!placeholder || placeholderLoaded.value) { return false }
      if (typeof placeholder === 'string') { return placeholder }

      const size = (Array.isArray(placeholder)
        ? placeholder
        : (typeof placeholder === 'number' ? [placeholder, placeholder] : [10, 10])) as [w: number, h: number, q: number]

      return $img(props.src, {
        ..._base.modifiers.value,
        width: size[0],
        height: size[1],
        quality: size[2] || 50
      }, _base.options.value)
    })

    const mainSrc = computed(() =>
      props.sizes
        ? sizes.value.src
        : $img(props.src, _base.modifiers.value, _base.options.value)
    )

    const src = computed(() => placeholder.value ? placeholder.value : mainSrc.value)

    if (props.preload) {
      const isResponsive = Object.values(sizes.value).every(v => v)
      useHead({
        link: [{
          rel: 'preload',
          as: 'image',
          ...(!isResponsive
            ? { href: src.value }
            : {
                href: sizes.value.src,
                imagesizes: sizes.value.sizes,
                imagesrcset: sizes.value.srcset
              })
        }]
      })
    }

    if (process.server && process.env.prerender) {
      const sources = [
        src.value,
        ...(sizes.value.srcset || '').split(',').map(s => s.split(' ')[0])
      ].filter(s => s && s.includes('/_ipx/'))
      appendHeader(useRequestEvent(), 'X-Nitro-Prerender', sources.join(','))
    }

    const imgEl = ref<HTMLImageElement>(null)

    onMounted(() => {
      if (placeholder.value) {
        const img = new Image()
        img.src = mainSrc.value
        img.onload = () => {
          imgEl.value.src = mainSrc.value
          placeholderLoaded.value = true
        }
      }
    })

    return () => h('img', {
      ref: imgEl,
      key: src.value,
      src: src.value,
      ...attrs.value,
      ...ctx.attrs
    })
  }
})
