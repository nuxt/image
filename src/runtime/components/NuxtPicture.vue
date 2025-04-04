<template>
  <picture>
    <source
      v-for="source in sources.slice(0, -1)"
      :key="source.src"
      :type="source.type"
      :sizes="source.sizes"
      :srcset="source.srcset"
    >

    <img
      v-if="lastSource"
      ref="imgEl"
      v-bind="{
        ...baseAttrs,
        ...(isServer ? { onerror: 'this.setAttribute(\'data-error\', 1)' } : {}),
        ...imgAttrs,
      }"
      :src="lastSource.src"
      :sizes="lastSource.sizes"
      :srcset="lastSource.srcset"
    >
  </picture>
</template>

<script setup lang="ts">
import type { Head } from '@unhead/vue'

import { computed, onMounted, ref, useAttrs } from 'vue'

import { prerenderStaticImages } from '../utils/prerender'
import { markFeatureUsage } from '../utils/performance'
import { getFileExtension } from '../utils'
import { useImage } from '../composables'
import { useBaseImage, pictureProps, baseImageProps } from './_base'

import { useHead, useRequestEvent } from '#imports'
import { useNuxtApp } from '#app/nuxt'

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

const legacyFormat = computed(() => {
  if (props.legacyFormat) {
    return props.legacyFormat
  }

  return isTransparent.value ? 'png' : 'jpeg'
})

type Source = { src?: string, srcset?: string, type?: string, sizes?: string }

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

const lastSource = computed(() => sources.value[sources.value.length - 1])

if (import.meta.server && props.preload) {
  useHead({ link: () => {
    const firstSource = sources.value[0]
    if (!firstSource) {
      return []
    }

    const link: NonNullable<Head['link']>[number] = {
      rel: 'preload',
      as: 'image',
      imagesrcset: firstSource.srcset,
      nonce: props.nonce,
      ...(typeof props.preload !== 'boolean' && props.preload?.fetchPriority
        ? { fetchpriority: props.preload.fetchPriority }
        : {}),
    }

    if (sources.value?.[0]?.sizes) {
      link.imagesizes = sources.value[0].sizes
    }
    return [link]
  } })
}

// Only passdown supported <image> attributes
const imgAttrs = computed(() => {
  const result: Record<string, string | unknown> = { ...props.imgAttrs, 'data-nuxt-pic': '' }
  for (const key in attrs) {
    if (key in baseImageProps && !(key in result)) {
      result[key] = attrs[key]
    }
  }
  return result
})

const imgEl = ref<HTMLImageElement>()

// Prerender static images
if (import.meta.server && import.meta.prerender) {
  for (const src of sources.value) {
    prerenderStaticImages(src.src, src.srcset, useRequestEvent())
  }
}

const nuxtApp = useNuxtApp()
const initialLoad = nuxtApp.isHydrating

onMounted(() => {
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
