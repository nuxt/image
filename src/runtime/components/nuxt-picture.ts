import { h, defineComponent, ref, computed, onMounted } from 'vue'
import { prerenderStaticImages } from '../utils/prerender'
import { useBaseImage, baseImageProps } from './_base'
import { useImage, useHead } from '#imports'
import { getFileExtension } from '#image'

export const pictureProps = {
  ...baseImageProps,
  legacyFormat: { type: String, default: null },
  imgAttrs: { type: Object, default: null }
}

export default defineComponent({
  name: 'NuxtPicture',
  props: pictureProps,
  emits: ['load'],
  setup: (props, ctx) => {
    const $img = useImage()
    const _base = useBaseImage(props)

    const isTransparent = computed(() => ['png', 'webp', 'gif'].includes(originalFormat.value))

    const originalFormat = computed(() => getFileExtension(props.src))

    const format = computed(() => props.format || (originalFormat.value === 'svg' ? 'svg' : 'webp'))

    const legacyFormat = computed(() => {
      if (props.legacyFormat) { return props.legacyFormat }
      const formats: Record<string, string> = {
        webp: isTransparent.value ? 'png' : 'jpeg',
        svg: 'png'
      }
      return formats[format.value] || originalFormat.value
    })

    type Source = { srcset: string, src?: string, type?: string, sizes?: string }
    const sources = computed<Source[]>(() => {
      if (format.value === 'svg') {
        return [<Source>{ src: props.src }]
      }

      const formats = legacyFormat.value !== format.value
        ? [legacyFormat.value, format.value]
        : [format.value]

      return formats.map((format) => {
        const { srcset, sizes, src } = $img.getSizes(props.src!, {
          ..._base.options.value,
          sizes: props.sizes || $img.options.screens,
          modifiers: { ..._base.modifiers.value, format }
        })

        return <Source> { src, type: `image/${format}`, sizes, srcset }
      })
    })

    if (props.preload) {
      const srcKey = sources.value?.[1] ? 1 : 0

      const link: any = { rel: 'preload', as: 'image', imagesrcset: sources.value[srcKey].srcset }

      if (sources.value?.[srcKey]?.sizes) { link.imagesizes = sources.value[srcKey].sizes }

      useHead({ link: [link] })
    }

    // Only passdown supported <image> attributes
    const imgAttrs: Record<string, string | unknown> = { ...props.imgAttrs, 'data-nuxt-pic': '' }
    for (const key in ctx.attrs) {
      if (key in baseImageProps && !(key in imgAttrs)) {
        imgAttrs[key] = ctx.attrs[key]
      }
    }

    const imgEl = ref<HTMLImageElement>()

    // Prerender static images
    if (process.server && process.env.prerender) {
      for (const src of sources.value as Source[]) {
        prerenderStaticImages(src.src, src.srcset)
      }
    }

    onMounted(() => {
      imgEl.value!.onload = (event) => {
        ctx.emit('load', event)
      }
    })

    return () => h('picture', { key: sources.value[0].src }, [
      ...(sources.value?.[1]
        ? [h('source', {
            type: sources.value[1].type,
            sizes: sources.value[1].sizes,
            srcset: sources.value[1].srcset
          })]
        : []),
      h('img', {
        ref: imgEl,
        ..._base.attrs.value,
        ...imgAttrs,
        src: sources.value[0].src,
        sizes: sources.value[0].sizes,
        srcset: sources.value[0].srcset
      })
    ])
  }
})
