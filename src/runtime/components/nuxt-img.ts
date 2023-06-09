import { h, defineComponent, ref, computed, onMounted } from 'vue'
import { useImage } from '../composables'
import { parseSize } from '../utils'
import { prerenderStaticImages } from '../utils/prerender'
import { baseImageProps, useBaseImage } from './_base'
import { useHead, useNuxtApp } from '#imports'

export const imgProps = {
  ...baseImageProps,
  placeholder: { type: [Boolean, String, Number, Array], default: undefined }
}

export default defineComponent({
  name: 'NuxtImg',
  props: imgProps,
  emits: ['load', 'error'],
  setup: (props, ctx) => {
    const $img = useImage()
    const _base = useBaseImage(props)

    const placeholderLoaded = ref(false)

    type AttrsT = typeof _base.attrs.value & {
      sizes?: string
      srcset?: string
      'data-nuxt-img'?: string
    }

    const sizes = computed(() => $img.getSizes(props.src!, {
      ..._base.options.value,
      sizes: props.sizes,
      modifiers: {
        ..._base.modifiers.value,
        width: parseSize(props.width),
        height: parseSize(props.height)
      }
    }))

    const attrs = computed(() => {
      const attrs: AttrsT = { ..._base.attrs.value, 'data-nuxt-img': '' }
      if (props.sizes) {
        attrs.sizes = sizes.value.sizes
        attrs.srcset = sizes.value.srcset
      } else if (props.densities || $img.options.densities) {
        attrs.srcset = $img.getDensitySet(props.src!, {
          ..._base.options.value,
          densities: props.densities,
          modifiers: {
            ..._base.modifiers.value,
            width: parseSize(props.width),
            height: parseSize(props.height)
          }
        })
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

      return $img(props.src!, {
        ..._base.modifiers.value,
        width: size[0],
        height: size[1],
        quality: size[2] || 50
      }, _base.options.value)
    })

    const mainSrc = computed(() =>
      props.sizes
        ? sizes.value.src
        : $img(props.src!, _base.modifiers.value, _base.options.value)
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

    // Prerender static images
    if (process.server && process.env.prerender) {
      prerenderStaticImages(src.value, sizes.value.srcset)
    }

    const imgEl = ref<HTMLImageElement>()

    const nuxtApp = useNuxtApp()
    const initialLoad = nuxtApp.isHydrating
    onMounted(() => {
      if (placeholder.value) {
        const img = new Image()
        img.src = mainSrc.value
        img.onload = (event) => {
          if (imgEl.value) {
            imgEl.value.src = mainSrc.value
          }
          placeholderLoaded.value = true
          ctx.emit('load', event)
        }
        return
      }

      if (!imgEl.value) { return }

      if (imgEl.value.complete && initialLoad) {
        if (imgEl.value.getAttribute('data-error')) {
          ctx.emit('error', new Event('error'))
        } else {
          ctx.emit('load', new Event('load'))
        }
      }

      imgEl.value.onload = (event) => {
        ctx.emit('load', event)
      }
      imgEl.value.onerror = (event) => {
        ctx.emit('error', event)
      }
    })

    return () => h('img', {
      ref: imgEl,
      key: src.value,
      src: src.value,
      ...process.server ? { onerror: 'this.setAttribute(\'data-error\', 1)' } : {},
      ...attrs.value,
      ...ctx.attrs
    })
  }
})
