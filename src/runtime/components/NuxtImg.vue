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

<script setup lang="ts" generic="Provider extends keyof ConfiguredImageProviders = ProviderDefaults['provider']">
import { computed, onMounted, ref, useAttrs, useTemplateRef } from 'vue'
import type { ImgHTMLAttributes } from 'vue'
import type { ProviderDefaults, ConfiguredImageProviders } from '@nuxt/image'

import { useImage } from '../composables'
import { parseSize } from '../utils'
import { prerenderStaticImages } from '../utils/prerender'
import { markFeatureUsage } from '../utils/performance'
import { useImageModifiers, useNormalisedAttrs, useProviderOptions } from './_base'
import type { BaseImageProps } from './_base'

import { useHead, useNuxtApp, useRequestEvent } from '#imports'

export interface ImageProps<Provider extends keyof ConfiguredImageProviders> extends BaseImageProps<Provider> {
  custom?: boolean
  placeholder?: boolean | string | number | [w: number, h: number, q?: number, b?: number]
  placeholderClass?: string
}

const attrs = useAttrs() as ImgHTMLAttributes
const props = defineProps<ImageProps<Provider>>()

const emit = defineEmits<{
  (event: 'load', payload: Event): unknown
  (event: 'error', payload: string | Event): unknown
}>()

const isServer = import.meta.server

const modifiers = useImageModifiers(props)

const $img = useImage()
const providerOptions = useProviderOptions(props)

const sizes = computed(() => $img.getSizes(props.src!, {
  ...providerOptions.value,
  sizes: props.sizes,
  densities: props.densities,
  modifiers: {
    ...modifiers.value,
    width: parseSize(props.width),
    height: parseSize(props.height),
  },
}))

const placeholderLoaded = ref(false)
const baseAttrs = useNormalisedAttrs(props)

const imgAttrs = computed(() => ({
  ...baseAttrs.value,
  'data-nuxt-img': '',
  ...(!props.placeholder || placeholderLoaded.value)
    ? { sizes: sizes.value.sizes, srcset: sizes.value.srcset }
    : {},
}))

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
    ...modifiers.value,
    width: size[0],
    height: size[1],
    quality: size[2] || 50,
    blur: size[3] || 3,
  }, providerOptions.value)
})

const mainSrc = computed(() =>
  props.sizes
    ? sizes.value.src
    : $img(props.src!, modifiers.value, providerOptions.value),
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

const initialLoad = useNuxtApp().isHydrating
const imgEl = useTemplateRef('imgEl')
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
