import { computed, defineComponent, h } from 'vue'
import { baseImageProps, useBaseImage } from './_base'
import { getFileExtension } from '#image'
import { useHead, useImage } from '#imports'

export const pictureProps = {
  ...baseImageProps,
  legacyFormat: { type: String, default: null },
  imgAttrs: { type: Object, default: null }
}

export default defineComponent({
  name: 'NuxtPicture',
  props: pictureProps,
  setup: (props, ctx) => {
    const $img = useImage()
    const _base = useBaseImage(props)

    const isTransparent = computed(() => ['png', 'webp', 'gif', 'svg'].includes(originalFormat.value))

    const originalFormat = computed(() => getFileExtension(props.src))

    const legacyFormat = computed(() => {
      if (props.legacyFormat) { return props.legacyFormat }
      return isTransparent.value ? 'png' : 'jpeg'
    })

    const nSources = computed<Array<{ srcset: string, src?: string, type?: string, sizes?: string }>>(() => {
      if (originalFormat.value === 'svg') {
        return [{ srcset: props.src }]
      }

      const format = props.format || originalFormat.value
      const formats = format.split(',')

      if (!formats.includes(legacyFormat.value)) {
        formats.push(legacyFormat.value)
      } else {
        formats.splice(formats.indexOf(legacyFormat.value), 1)
        formats.push(legacyFormat.value)
      }

      return formats.map((format) => {
        const { srcset, sizes, src } = $img.getSizes(props.src, {
          ..._base.options.value,
          sizes: props.sizes || $img.options.screens,
          modifiers: { ..._base.modifiers.value, format }
        })
        if (format === 'svg') { return { srcset } }
        return { src, type: `image/${format}`, sizes, srcset }
      })
    })

    if (props.preload) {
      const srcKey = nSources.value?.[1] ? 1 : 0

      const link: any = { rel: 'preload', as: 'image', imagesrcset: nSources.value[srcKey].srcset }

      if (nSources.value?.[srcKey]?.sizes) { link.imagesizes = nSources.value[srcKey].sizes }

      useHead({ link: [link] })
    }

    // Only passdown supported <image> attributes
    const imgAttrs = { ...props.imgAttrs }
    for (const key in ctx.attrs) {
      if (key in baseImageProps && !(key in imgAttrs)) {
        imgAttrs[key] = ctx.attrs[key]
      }
    }

    return () => h('picture', { key: nSources.value[0].src }, [
      nSources.value.slice(0, -1).map(source => h('source', {
        type: source.type,
        sizes: source.sizes,
        srcset: source.srcset
      })),
      h('img', {
        ..._base.attrs.value,
        ...imgAttrs,
        src: nSources.value.at(-1).src,
        sizes: nSources.value.at(-1).sizes,
        srcset: nSources.value.at(-1).srcset
      })
    ])
  }
})
