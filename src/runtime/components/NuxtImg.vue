<template>
  <img
    v-if="!custom"
    ref="imgEl"
    :class="placeholder && !placeholderLoaded ? placeholderClass : undefined"
    v-bind="{
      ...isServer ? { onerror: 'this.setAttribute(\'data-error\', 1)' } : {},
      ...imgAttrs,
      ...attrs,
    }"
    :src="src"
  >
  <slot
    v-else
    v-bind="{
      ...isServer ? { onerror: 'this.setAttribute(\'data-error\', 1)' } : {},
      imgAttrs: {
        ...imgAttrs,
        ...attrs,
      },
      isLoaded: placeholderLoaded,
      src,
    }"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useAttrs } from 'vue'

import { useImage } from '../composables'
import { parseSize } from '../utils'
import { prerenderStaticImages } from '../utils/prerender'
import { markFeatureUsage } from '../utils/performance'
import { imgProps, useBaseImage } from './_base'

import { useHead, useRequestEvent } from '#imports'
import { useNuxtApp } from '#app/nuxt'

const props = defineProps(imgProps)

const attrs = useAttrs()

const emit = defineEmits<{
  (event: 'load', payload: Event): unknown
  (event: 'error', payload: string | Event): unknown
}>()

const isServer = import.meta.server

const $img = useImage()

const _base = useBaseImage(props)

const placeholderLoaded = ref(false)
const imgEl = ref<HTMLImageElement>()

type AttrsT = typeof _base.attrs.value & {
  'sizes'?: string
  'srcset'?: string
  'data-nuxt-img'?: string
}

const sizes = computed(() => $img.getSizes(props.src!, {
  ..._base.options.value,
  sizes: props.sizes,
  densities: props.densities,
  modifiers: {
    ..._base.modifiers.value,
    width: parseSize(props.width),
    height: parseSize(props.height),
  },
}))

const imgAttrs = computed(() => {
  const attrs: AttrsT = { ..._base.attrs.value, 'data-nuxt-img': '' }

  if (!props.placeholder || placeholderLoaded.value) {
    attrs.sizes = sizes.value.sizes
    attrs.srcset = sizes.value.srcset
  }

  return attrs
})

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

const mainSrc = computed(() =>
  props.sizes
    ? sizes.value.src
    : $img(props.src!, _base.modifiers.value, _base.options.value),
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
  prerenderStaticImages(src.value, sizes.value.srcset, useRequestEvent())
}

const nuxtApp = useNuxtApp()

const initialLoad = nuxtApp.isHydrating

onMounted(() => {
  if (placeholder.value || props.custom) {
    const img = new Image()

    if (mainSrc.value) {
      img.src = mainSrc.value
    }

    if (props.sizes) {
      img.sizes = sizes.value.sizes || ''
      img.srcset = sizes.value.srcset
    }

    img.onload = (event) => {
      placeholderLoaded.value = true
      emit('load', event)
    }

    img.onerror = (event) => {
      emit('error', event)
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
