<template>
  <picture>
    <source
      v-for="source in sources.slice(0, -1)"
      :key="source.src"
      :type="placeholder ? 'display/never' : source.type"
      :sizes="source.sizes"
      :srcset="source.srcset"
    >

    <img
      ref="imgEl"
      v-bind="{
        ...baseAttrs,
        ...(isServer ? { onerror: 'this.setAttribute(\'data-error\', 1)' } : {}),
        ...imgAttrs,
      }"
      :src="placeholder ? placeholder : sources[lastSourceIndex].src"
      :sizes="placeholder ? undefined : sources[lastSourceIndex].sizes"
      :srcset="placeholder ? undefined : sources[lastSourceIndex].srcset"
    >
  </picture>
</template>

<script setup lang="ts">
import type { Head } from '@unhead/vue'
import { useHead } from '@unhead/vue'
import { computed, onMounted, ref, useAttrs } from 'vue'
import { prerenderStaticImages } from '../utils/prerender'
import { markFeatureUsage } from '../utils/performance'
import { getFileExtension } from '../utils'
import { useImage } from '../composables'
import { useBaseImage, pictureProps, baseImageProps } from './_base'
import { useNuxtApp } from '#app'

const props = defineProps(pictureProps)

const attrs = useAttrs()

const emit = defineEmits<{
  (event: 'load', payload: Event): unknown
  (event: 'error', payload: string | Event): unknown
}>()

const isServer = import.meta.server

const $img = useImage()

const { attrs: baseAttrs, options: baseOptions, modifiers: baseModifiers } = useBaseImage(props)

const originalFormat = computed(() => getFileExtension(props.src))

const isTransparent = computed(() => ['png', 'webp', 'gif', 'svg'].includes(originalFormat.value))
const placeholderLoaded = ref(false)

const legacyFormat = computed(() => {
  if (props.legacyFormat) {
    return props.legacyFormat
  }

  return isTransparent.value ? 'png' : 'jpeg'
})

type Source = { src: string, srcset?: string, type?: string, sizes?: string }

const sources = computed<Source[]>(() => {
  const formats = props.format?.split(',') || (originalFormat.value === 'svg' ? ['svg'] : ($img.options.format?.length ? [...$img.options.format] : ['webp']))

  if (formats[0] === 'svg') {
    return [{ src: props.src! }]
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
      ...baseOptions.value,
      sizes: props.sizes || $img.options.screens,
      densities: props.densities,
      modifiers: { ...baseModifiers.value, format },
    })

    return { src, type: `image/${format}`, sizes, srcset }
  })
})

const lastSourceIndex = computed(() => sources.value.length - 1)
const mainSrc = computed(() => sources.value[lastSourceIndex.value])

if (import.meta.server && props.preload) {
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

for (const key in attrs) {
  if (key in baseImageProps && !(key in imgAttrs)) {
    imgAttrs[key] = attrs[key]
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
    ...baseModifiers.value,
    width: size[0],
    height: size[1],
    quality: size[2] || 50,
    blur: size[3] || 3,
  }, baseOptions.value)
})

const imgEl = ref<HTMLImageElement>()

// Prerender static images
if (import.meta.server && import.meta.prerender) {
  for (const src of sources.value) {
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
      emit('load', event)
    }

    markFeatureUsage('nuxt-picture')
    return
  }

  if (!imgEl.value) {
    return
  }

  if (imgEl.value.complete && initialLoad) {
    if (imgEl.value.getAttribute('data-error')) {
      emit('error', new Event('error'))
    }
    else {
      emit('load', new Event('load'))
    }
  }

  imgEl.value.onload = (event) => {
    emit('load', event)
  }

  imgEl.value.onerror = (event) => {
    emit('error', event)
  }

  markFeatureUsage('nuxt-picture')
})
</script>

<script lang="ts">
export { pictureProps } from './_base'
</script>
