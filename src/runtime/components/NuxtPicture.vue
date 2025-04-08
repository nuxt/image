<template>
  <picture v-bind="attrs.picture">
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
        ...attrs.img,
        'data-nuxt-pic': '',
      }"
      :src="lastSource.src"
      :sizes="lastSource.sizes"
      :srcset="lastSource.srcset"
    >
  </picture>
</template>

<script setup lang="ts" generic="Provider extends keyof ConfiguredImageProviders = ProviderDefaults['provider']">
import type { SerializableHead } from '@unhead/vue/types'

import { computed, onMounted, useAttrs, useTemplateRef } from 'vue'
import type { ImgHTMLAttributes } from 'vue'

import type { ConfiguredImageProviders, ProviderDefaults } from '@nuxt/image'
import { prerenderStaticImages } from '../utils/prerender'
import { markFeatureUsage } from '../utils/performance'
import { getFileExtension } from '../utils'
import { useImage } from '../composables'
import { useImageModifiers, useNormalisedAttrs, useProviderOptions } from './_base'
import type { BaseImageProps } from './_base'

import { useHead, useNuxtApp, useRequestEvent } from '#imports'

export interface PictureProps<Provider extends keyof ConfiguredImageProviders> extends BaseImageProps<Provider> {
  legacyFormat?: string
  imgAttrs?: ImgHTMLAttributes
}

defineOptions({ inheritAttrs: false })

const props = defineProps<PictureProps<Provider>>()

const emit = defineEmits<{
  (event: 'load', payload: Event): unknown
  (event: 'error', payload: string | Event): unknown
}>()

const isServer = import.meta.server

const baseAttrs = useNormalisedAttrs(props)

// Only pass down supported <image> attributes
const _attrs = useAttrs()
const imageAttrNames = new Set(['alt', 'referrerpolicy', 'usemap', 'longdesc', 'ismap', 'loading', 'crossorigin', 'decoding', 'nonce'])
const attrs = computed(() => {
  const attrs: Record<string, Record<string, unknown>> = {
    img: { ...props.imgAttrs },
    picture: {},
  }
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

const originalFormat = computed(() => getFileExtension(props.src))
const isTransparent = computed(() => ['png', 'webp', 'gif', 'svg'].includes(originalFormat.value))

const legacyFormat = computed(() => {
  if (props.legacyFormat) {
    return props.legacyFormat
  }

  return isTransparent.value ? 'png' : 'jpeg'
})

type Source = { src?: string, srcset?: string, type?: string, sizes?: string }

const $img = useImage()
const providerOptions = useProviderOptions(props)
const modifiers = useImageModifiers(props)

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
      modifiers: { ...modifiers.value, format },
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

    const link: NonNullable<SerializableHead['link']>[number] = {
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
