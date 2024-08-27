<template>
  <img
    ref="imgEl"
    v-bind="{
      ...isServer ? { onerror: 'this.setAttribute(\'data-error\', 1)' } : {},
      ..._attrs,
      ...attrs,
      ...(placeholderClass && placeholder) ? { class: placeholderClass } : {},
    }"
    :src="src"
  >
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useAttrs } from 'vue'
import { useHead } from '@unhead/vue'
import { useImage } from '../composables'
import { parseSize } from '../utils'
import { prerenderStaticImages } from '../utils/prerender'
import { markFeatureUsage } from '../utils/performance'
import { imgProps, useBaseImage } from './_base'
import { useNuxtApp } from '#app'

const props = defineProps(imgProps)

const attrs = useAttrs()

const emit = defineEmits<{
  (event: 'load', payload: Event): unknown
  (event: 'error', payload: string | Event): unknown
}>()

const isServer = import.meta.server

const $img = useImage()

const { placeholder, placeholderLoaded, options: baseOptions, modifiers: baseModifiers, attrs: baseAttrs } = useBaseImage(props)

const imgEl = ref<HTMLImageElement>()

type AttrsT = typeof baseAttrs.value & {
  'sizes'?: string
  'srcset'?: string
  'data-nuxt-img'?: string
}

const sizes = computed(() => $img.getSizes(props.src!, {
  ...baseOptions.value,
  sizes: props.sizes,
  densities: props.densities,
  modifiers: {
    ...baseModifiers.value,
    width: parseSize(props.width),
    height: parseSize(props.height),
  },
}))

const _attrs = computed(() => {
  const attrs: AttrsT = { ...baseAttrs.value, 'data-nuxt-img': '' }

  if (!props.placeholder || placeholderLoaded.value) {
    attrs.sizes = sizes.value.sizes
    attrs.srcset = sizes.value.srcset
  }

  return attrs
})

const mainSrc = computed(() =>
  props.sizes
    ? sizes.value.src
    : $img(props.src!, baseModifiers.value, baseOptions.value),
)

const src = computed(() => placeholder.value ? placeholder.value : mainSrc.value)

if (import.meta.server && props.preload) {
  const isResponsive = Object.values(sizes.value).every(v => v)

  useHead({
    link: [{
      rel: 'preload',
      as: 'image',
      nonce: props.nonce,
      ...(!isResponsive
        ? { href: src.value }
        : {
            href: sizes.value.src,
            imagesizes: sizes.value.sizes,
            imagesrcset: sizes.value.srcset,
          }),
      ...(typeof props.preload !== 'boolean' && props.preload.fetchPriority
        ? { fetchpriority: props.preload.fetchPriority }
        : {}),
    }],
  })
}

// Prerender static images
if (import.meta.server && import.meta.prerender) {
  prerenderStaticImages(src.value, sizes.value.srcset)
}

const nuxtApp = useNuxtApp()

const initialLoad = nuxtApp.isHydrating

onMounted(() => {
  if (placeholder.value) {
    const img = new Image()

    if (props.sizes) {
      img.sizes = sizes.value.sizes || ''
      img.srcset = sizes.value.srcset
    }

    img.src = mainSrc.value

    img.onload = (event) => {
      placeholderLoaded.value = true
      emit('load', event)
    }

    markFeatureUsage('nuxt-image')

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
})
</script>

<script lang="ts">
export { imgProps } from './_base'
</script>
