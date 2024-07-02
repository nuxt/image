import { h, defineComponent, ref, computed, onMounted } from 'vue'
import type { Head } from '@unhead/vue'
import { prerenderStaticImages } from '../utils/prerender'
import { markFeatureUsage } from '../utils/performance'
import { useBaseImage, baseImageProps } from './_base'
import { useImage, useHead, useNuxtApp } from '#imports'
import { getFileExtension } from '#image'

export const pictureProps = {
  ...baseImageProps,
  legacyFormat: { type: String, default: null },
  imgAttrs: { type: Object, default: null },
  placeholder: { type: [Boolean, String, Number, Array], default: undefined },
  placeholderClass: { type: String, default: undefined },
}

export default defineComponent({
  name: 'NuxtPicture',
  props: pictureProps,
  emits: ['load', 'error'],
  setup: (props, ctx) => {
    const $img = useImage()
    const _base = useBaseImage(props)

    const originalFormat = computed(() => getFileExtension(props.src))
    const isTransparent = computed(() => ['png', 'webp', 'gif', 'svg'].includes(originalFormat.value))
    const placeholderLoaded = ref(false)

    const legacyFormat = computed(() => {
      if (props.legacyFormat) {
        return props.legacyFormat
      }
      return isTransparent.value ? 'png' : 'jpeg'
    })

    type Source = { srcset?: string, src?: string, type?: string, sizes?: string }
    const sources = computed<Source[]>(() => {
      const formats = props.format?.split(',') || (originalFormat.value === 'svg' ? ['svg'] : ($img.options.format?.length ? [...$img.options.format] : ['webp']))
      if (formats[0] === 'svg') {
        return [<Source> { src: props.src }]
      }

      if (!formats.includes(legacyFormat.value)) {
        formats.push(legacyFormat.value)
      }
      else {
        formats.splice(formats.indexOf(legacyFormat.value), 1)
        formats.push(legacyFormat.value)
      }

      return formats.map((format) => {
        const { srcset, sizes, src } = $img.getSizes(props.src!, {
          ..._base.options.value,
          sizes: props.sizes || $img.options.screens,
          densities: props.densities,
          modifiers: { ..._base.modifiers.value, format },
        })

        return <Source> { src, type: `image/${format}`, sizes, srcset }
      })
    })
    const lastSourceIndex = computed(() => sources.value.length - 1)

    const mainSrc = computed(() => sources.value[lastSourceIndex.value])

    if (props.preload) {
      const link: NonNullable<Head['link']>[number] = {
        rel: 'preload',
        as: 'image',
        imagesrcset: sources.value[0].srcset,
        nonce: props.nonce,
        ...(typeof props.preload !== 'boolean' && props.preload.fetchPriority
          ? { fetchpriority: props.preload.fetchPriority }
          : {}),
      }

      if (sources.value?.[0]?.sizes) {
        link.imagesizes = sources.value[0].sizes
      }

      useHead({ link: [link] })
    }

    // Only passdown supported <image> attributes
    const imgAttrs: Record<string, string | unknown> = { ...props.imgAttrs, 'data-nuxt-pic': '' }
    for (const key in ctx.attrs) {
      if (key in baseImageProps && !(key in imgAttrs)) {
        imgAttrs[key] = ctx.attrs[key]
      }
    }

    const placeholder = computed(() => {
      let placeholder = props.placeholder
      if (placeholder === '') {
        placeholder = true
      }
      if (!placeholder || placeholderLoaded.value) {
        return false
      }
      if (typeof placeholder === 'string') {
        return placeholder
      }

      const size = (Array.isArray(placeholder)
        ? placeholder
        : (typeof placeholder === 'number' ? [placeholder, placeholder] : [10, 10])) as [w: number, h: number, q: number, b: number]

      return $img(props.src!, {
        ..._base.modifiers.value,
        width: size[0],
        height: size[1],
        quality: size[2] || 50,
        blur: size[3] || 3,
      }, _base.options.value)
    })

    const imgEl = ref<HTMLImageElement>()

    // Prerender static images
    if (import.meta.server && process.env.prerender) {
      for (const src of sources.value as Source[]) {
        prerenderStaticImages(src.src, src.srcset)
      }
    }

    const nuxtApp = useNuxtApp()
    const initialLoad = nuxtApp.isHydrating
    onMounted(() => {
      if (placeholder.value) {
        const img = new Image()

        if (mainSrc.value.src) img.src = mainSrc.value.src
        if (mainSrc.value.sizes) img.sizes = mainSrc.value.sizes
        if (mainSrc.value.srcset) img.srcset = mainSrc.value.srcset

        img.onload = (event) => {
          placeholderLoaded.value = true
          ctx.emit('load', event)
        }

        markFeatureUsage('nuxt-picture')
        return
      }

      if (!imgEl.value) {
        return
      }

      if (imgEl.value.complete && initialLoad) {
        if (imgEl.value.getAttribute('data-error')) {
          ctx.emit('error', new Event('error'))
        }
        else {
          ctx.emit('load', new Event('load'))
        }
      }
      imgEl.value.onload = (event) => {
        ctx.emit('load', event)
      }
      imgEl.value.onerror = (event) => {
        ctx.emit('error', event)
      }

      markFeatureUsage('nuxt-picture')
    })

    return () =>
      h('picture', null, [
        ...sources.value.slice(0, -1).map((source) => {
          return h('source', {
            type: placeholder.value ? 'display/never' : source.type,
            sizes: source.sizes,
            srcset: source.srcset,
          })
        }),
        h('img', {
          ref: imgEl,
          ..._base.attrs.value,
          ...(import.meta.server ? { onerror: 'this.setAttribute(\'data-error\', 1)' } : {}),
          ...imgAttrs,
          src: placeholder.value ? placeholder.value : sources.value[lastSourceIndex.value].src,
          sizes: placeholder.value ? undefined : sources.value[lastSourceIndex.value].sizes,
          srcset: placeholder.value ? undefined : sources.value[lastSourceIndex.value].srcset,
        }),
      ])
  },
})
