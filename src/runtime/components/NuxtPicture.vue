<template>
  <picture v-bind="attrs.picture">
    <template v-for="(source, index) of sources">
      <source
        v-if="index + 1 < sources.length"
        :key="source.src"
        :type="source.type"
        :sizes="source.sizes"
        :srcset="source.srcset"
      >
      <img
        v-else
        ref="imgEl"
        :key="'last' + source.src"
        v-bind="attrs.img"
        :src="source.src"
        :sizes="source.sizes"
        :srcset="source.srcset"
      >
    </template>
  </picture>
</template>

<script setup lang="ts" generic="Provider extends keyof ConfiguredImageProviders = ProviderDefaults['provider']">
import type { SerializableHead } from '@unhead/vue/types'
import type { ImgHTMLAttributes } from 'vue'

import { computed, onMounted, useAttrs, useTemplateRef } from 'vue'

import { prerenderStaticImages } from '../utils/prerender'
import { markFeatureUsage } from '../utils/performance'
import { useImage } from '../composables'
import { useImageProps } from '../utils/props'
import type { BaseImageProps } from '../utils/props'
import type { ConfiguredImageProviders, ProviderDefaults } from '@nuxt/image'

import { useHead, useNuxtApp, useRequestEvent } from '#imports'

export interface PictureProps<Provider extends keyof ConfiguredImageProviders> extends BaseImageProps<Provider> {
  legacyFormat?: string
  imgAttrs?: ImgHTMLAttributes
}

defineOptions({ inheritAttrs: false })
defineSlots<{ default(props: DefaultSlotProps): any }>()

const props = defineProps<PictureProps<Provider>>()

const emit = defineEmits<{
  (event: 'load', payload: Event): unknown
  (event: 'error', payload: string | Event): unknown
}>()

const _attrs = useAttrs()
const imageAttrNames = new Set(['alt', 'referrerpolicy', 'usemap', 'longdesc', 'ismap', 'loading', 'crossorigin', 'decoding'])
const attrs = computed(() => {
  const attrs: Record<'img' | 'picture', Record<string, unknown>> = {
    img: {
      ...normalizedAttrs.value,
      ...props.imgAttrs,
      ...(import.meta.server ? { onerror: 'this.setAttribute(\'data-error\', 1)' } : {}),
      'data-nuxt-pic': '',
    },
    picture: {},
  }
  // Only pass down supported <image> attributes
  for (const key in _attrs) {
    if (imageAttrNames.has(key)) {
      if (!(key in attrs.img)) {
        attrs.img[key] = _attrs[key]
      }
    }
    else {
      attrs.picture[key] = _attrs[key]
    }
  }
  return attrs
})

const originalFormat = computed(() => props.src?.match(/^[^?#]+\.(\w+)(?:$|[?#])/)?.[1])

const legacyFormat = computed(() => {
  if (props.legacyFormat) {
    return props.legacyFormat
  }

  const isNotTransparent = !originalFormat.value || !['png', 'webp', 'gif', 'svg'].includes(originalFormat.value)
  return isNotTransparent ? 'jpeg' : 'png'
})

const $img = useImage()
const { providerOptions, imageModifiers, normalizedAttrs } = useImageProps(props)

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
      ...providerOptions.value,
      sizes: props.sizes || $img.options.screens,
      densities: props.densities,
      modifiers: { ...imageModifiers.value, format },
    })

    return { src, type: `image/${format}`, sizes, srcset }
  })
})

if (import.meta.server && props.preload) {
  useHead({ link: () => {
    const firstSource = sources.value[0]
    if (!firstSource) {
      return []
    }

    const link: NonNullable<SerializableHead['link']>[number] = {
      rel: 'preload',
      as: 'image',
      imagesrcset: firstSource.srcset,
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

// Prerender static images
if (import.meta.server && import.meta.prerender) {
  for (const src of sources.value) {
    prerenderStaticImages(src.src, src.srcset, useRequestEvent())
  }
}

const nuxtApp = useNuxtApp()
const initialLoad = nuxtApp.isHydrating

const imgEl = useTemplateRef('imgEl')
onMounted(() => {
  const el = Array.isArray(imgEl.value) ? imgEl.value[0] as HTMLImageElement | undefined : imgEl.value
  if (!el) {
    return
  }

  if (el.complete && initialLoad) {
    if (el.getAttribute('data-error')) {
      emit('error', new Event('error'))
    }
    else {
      emit('load', new Event('load'))
    }
  }

  el.onload = (event) => {
    emit('load', event)
  }

  el.onerror = (event) => {
    emit('error', event)
  }

  markFeatureUsage('nuxt-picture')
})
</script>

<script lang="ts">
export interface DefaultSlotProps {
  imgAttrs: ImgHTMLAttributes
  isLoaded: boolean
  src?: string
}
</script>
