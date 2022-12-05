import { h, defineComponent, computed } from 'vue'
import { useBaseImage, baseImageProps } from './_base'
import { useImage, useHead, useRequestEvent } from '#imports'
import { getFileExtension } from '#image'
import { appendHeader } from 'h3'

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

    const isTransparent = computed(() => ['png', 'webp', 'gif'].includes(originalFormat.value))

    const originalFormat = computed(() => getFileExtension(props.src))

    const format = computed(() => props.format || originalFormat.value === 'svg' ? 'svg' : 'webp')

    const legacyFormat = computed(() => {
      if (props.legacyFormat) { return props.legacyFormat }
      const formats: Record<string, string> = {
        webp: isTransparent.value ? 'png' : 'jpeg',
        svg: 'png'
      }
      return formats[format.value] || originalFormat.value
    })

    const nSources = computed<Array<{ srcset: string, src?: string, type?: string, sizes?: string }>>(() => {
      if (format.value === 'svg') {
        return [{ srcset: props.src }]
      }

      const formats = legacyFormat.value !== format.value
        ? [legacyFormat.value, format.value]
        : [format.value]

      return formats.map((format) => {
        const { srcset, sizes, src } = $img.getSizes(props.src, {
          ..._base.options.value,
          sizes: props.sizes || $img.options.screens,
          modifiers: { ..._base.modifiers.value, format }
        })

        return { src, type: `image/${format}`, sizes, srcset }
      })
    })

    if (props.preload) {
      const srcKey = nSources.value?.[1] ? 1 : 0

      const link: any = { rel: 'preload', as: 'image', imagesrcset: nSources.value[srcKey].srcset }

      if (nSources.value?.[srcKey]?.sizes) { link.imagesizes = nSources.value[srcKey].sizes }

      useHead({ link: [link] })
    }

    if (process.server && process.env.prerender) {
      const srcKey = nSources.value?.[1] ? 1 : 0
      const sources = [
        nSources.value[srcKey].src,
        ...(nSources.value[srcKey].srcset || '').split(',').map(s => s.trim().split(' ')[0])
      ].filter(s => s && s.includes('/_ipx/'))
      appendHeader(useRequestEvent(), 'X-Nitro-Prerender', sources.join(','))
    }

    // Only passdown supported <image> attributes
    const imgAttrs = { ...props.imgAttrs }
    for (const key in ctx.attrs) {
      if (key in baseImageProps && !(key in imgAttrs)) {
        imgAttrs[key] = ctx.attrs[key]
      }
    }

    return () => h('picture', { key: nSources.value[0].src }, [
      ...(nSources.value?.[1]
        ? [h('source', {
            type: nSources.value[1].type,
            sizes: nSources.value[1].sizes,
            srcset: nSources.value[1].srcset
          })]
        : []),
      h('img', {
        ..._base.attrs.value,
        ...imgAttrs,
        src: nSources.value[0].src,
        sizes: nSources.value[0].sizes,
        srcset: nSources.value[0].srcset
      })
    ])
  }
})
