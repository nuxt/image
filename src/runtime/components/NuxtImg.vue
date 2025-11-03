<template>
  <img
    v-if="!custom"
    ref="imgEl"
    :class="placeholder ? placeholderClass : undefined"
    v-bind="imgAttrs"
    :src="src"
  >
  <slot
    v-else
    v-bind="{
      imgAttrs,
      isLoaded: placeholderLoaded,
      src,
    }"
  />
</template>

<script setup lang="ts" generic="Provider extends keyof ConfiguredImageProviders = ProviderDefaults['provider']">
import { computed, onMounted, ref, useAttrs, useTemplateRef } from 'vue'
import type { ImgHTMLAttributes } from 'vue'

import { useImage } from '../composables'
import { prerenderStaticImages } from '../utils/prerender'
import { useImageProps } from '../utils/props'
import type { BaseImageProps } from '../utils/props'
import { markFeatureUsage } from '../utils/performance'
import type { ProviderDefaults, ConfiguredImageProviders } from '@nuxt/image'

import { useHead, useNuxtApp, useRequestEvent } from '#imports'

export interface ImageProps<Provider extends keyof ConfiguredImageProviders> extends BaseImageProps<Provider> {
  custom?: boolean
  placeholder?: boolean | string | number | [w: number, h: number, q?: number, b?: number]
  placeholderClass?: string
}

const props = defineProps<ImageProps<Provider>>()

const emit = defineEmits<{
  (event: 'load', payload: Event): unknown
  (event: 'error', payload: string | Event): unknown
}>()

defineSlots<{ default(props: DefaultSlotProps): any }>()

const $img = useImage()
const { providerOptions, normalizedAttrs, imageModifiers } = useImageProps(props)

const sizes = computed(() => $img.getSizes(props.src!, {
  ...providerOptions.value,
  sizes: props.sizes,
  densities: props.densities,
  modifiers: imageModifiers.value,
}))

const placeholderLoaded = ref(false)

const attrs = useAttrs() as ImgHTMLAttributes
const imgAttrs = computed(() => {
  const base: ImgHTMLAttributes = {
    ...normalizedAttrs.value,
    'data-nuxt-img': '',
    ...!props.placeholder
      ? { sizes: sizes.value.sizes, srcset: sizes.value.srcset }
      : {},
    ...import.meta.server ? { onerror: 'this.setAttribute(\'data-error\', 1)' } : {},
  }

  if (props.placeholder) {
    const chainHandlers = (a?: any, b?: any) =>
      (a && b)
        ? (...args: any[]) => {
            a(...args)
            b(...args)
          }
        : (a || b)

    base.onLoad = chainHandlers(base.onLoad, (event: Event) => {
      if (!placeholderLoaded.value) {
        // Placeholder just loaded, trigger src update to mainSrc
        placeholderLoaded.value = true
      }
      else {
        // Main image loaded
        emit('load', event)
      }
    })

    base.onError = chainHandlers(base.onError, (event: Event) => {
      emit('error', event)
    })
  }

  return {
    ...base,
    ...attrs,
  }
})

const placeholder = computed(() => {
  if (placeholderLoaded.value) {
    return false
  }

  const placeholder = props.placeholder === '' ? [10, 10] : props.placeholder

  if (!placeholder) {
    return false
  }

  if (typeof placeholder === 'string') {
    return placeholder
  }

  const [width = 10, height = width, quality = 50, blur = 3] = Array.isArray(placeholder)
    ? placeholder
    : typeof placeholder === 'number' ? [placeholder] : []

  return $img(props.src!, {
    ...imageModifiers.value,
    width,
    height,
    quality,
    blur,
  }, providerOptions.value)
})

const mainSrc = computed(() =>
  props.sizes
    ? sizes.value.src
    : $img(props.src!, imageModifiers.value, providerOptions.value),
)

const src = computed(() => placeholder.value || mainSrc.value)

if (import.meta.server && props.preload) {
  const hasMultipleDensities = sizes.value.srcset.includes('x, ')
  const isResponsive = hasMultipleDensities || !!sizes.value.sizes

  useHead({
    link: [{
      rel: 'preload',
      as: 'image',
      nonce: props.nonce,
      href: isResponsive ? sizes.value.src : src.value,
      ...(sizes.value.sizes && { imagesizes: sizes.value.sizes }),
      ...(hasMultipleDensities && { imagesrcset: sizes.value.srcset }),
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
  markFeatureUsage('nuxt-img')

  if (!imgEl.value) {
    return
  }

  if (imgEl.value.complete && initialLoad) {
    if (imgEl.value.getAttribute('data-error')) {
      emit('error', new Event('error'))
    }
    else if (props.placeholder && !placeholderLoaded.value) {
      placeholderLoaded.value = true
    }
    else {
      emit('load', new Event('load'))
    }
  }

  if (!props.placeholder) {
    imgEl.value.onload = (event) => {
      emit('load', event)
    }

    imgEl.value.onerror = (event) => {
      emit('error', event)
    }
  }
})
</script>

<script lang="ts">
export interface DefaultSlotProps {
  imgAttrs: ImgHTMLAttributes
  isLoaded: boolean
  src?: string
}
</script>
