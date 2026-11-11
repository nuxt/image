<template>
  <picture v-bind="attrs.picture">
    <template v-for="(source, index) of sources">
      <source
        v-if="index + 1 < sources.length && !placeholder"
        :key="source.src"
        :type="source.type"
        :sizes="source.sizes"
        :srcset="source.srcset"
      >
      <img
        v-else-if="index + 1 === sources.length"
        ref="imgEl"
        :key="'last' + source.src"
        :class="placeholder ? placeholderClass : undefined"
        v-bind="attrs.img"
        :src="placeholder || source.src"
        :sizes="placeholder ? undefined : source.sizes"
        :srcset="placeholder ? undefined : source.srcset"
      >
    </template>
  </picture>
</template>

<script setup lang="ts" generic="Provider extends keyof ConfiguredImageProviders = ProviderDefaults['provider']">
import type { SerializableHead } from '@unhead/vue/types'
import type { ImgHTMLAttributes } from 'vue'

import { computed, onMounted, ref, useAttrs, useTemplateRef } from 'vue'

import { prerenderStaticImages } from '../utils/prerender'
import { markFeatureUsage } from '../utils/performance'
import { useImage } from '../composables'
import { resolvePlaceholder, useImageProps } from '../utils/props'
import type { BaseImageProps, PlaceholderProp } from '../utils/props'
import type { DataAttributes } from '../types'
import type { ConfiguredImageProviders, ProviderDefaults } from '@nuxt/image'

import { useHead, useNuxtApp, useRequestEvent } from '#imports'

export interface PictureProps<Provider extends keyof ConfiguredImageProviders> extends BaseImageProps<Provider> {
  legacyFormat?: string
  imgAttrs?: ImgHTMLAttributes & DataAttributes
  placeholder?: PlaceholderProp
  placeholderClass?: string
}

defineOptions({ inheritAttrs: false })

const props = defineProps<PictureProps<Provider>>()

const emit = defineEmits<{
  (event: 'load', payload: Event): unknown
  (event: 'error', payload: string | Event): unknown
}>()

const _attrs = useAttrs()
const imageAttrNames = new Set(['alt', 'referrerpolicy', 'usemap', 'longdesc', 'ismap', 'loading', 'crossorigin', 'decoding', 'nonce'])
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

const placeholderLoaded = ref(false)

// The placeholder is rendered as a plain `<img>` (without any `<source>`) until
// the real image has been loaded.
const placeholder = computed(() => {
  // SVGs are not converted into multiple formats, so there is nothing to wait for
  if (placeholderLoaded.value || !sources.value.some(source => source.type)) {
    return false
  }

  const placeholder = resolvePlaceholder(props.placeholder)

  if (typeof placeholder !== 'object') {
    return placeholder
  }

  return $img(props.src!, {
    ...imageModifiers.value,
    ...placeholder,
    format: legacyFormat.value,
  }, providerOptions.value)
})

if (import.meta.server && props.preload) {
  useHead({ link: () => {
    const firstSource = sources.value[0]
    if (!firstSource?.srcset) {
      return []
    }

    const link: NonNullable<SerializableHead['link']>[number] = {
      rel: 'preload',
      as: 'image',
      imagesrcset: firstSource.srcset,
      nonce: props.nonce,
      ...(firstSource.sizes ? { imagesizes: firstSource.sizes } : {}),
      ...(typeof props.preload !== 'boolean' && props.preload?.fetchPriority
        ? { fetchpriority: props.preload.fetchPriority }
        : {}),
    }

    return [link]
  } })
}

// Prerender static images
if (import.meta.server && import.meta.prerender) {
  for (const src of sources.value) {
    prerenderStaticImages(src.src, src.srcset, useRequestEvent())
  }
  if (placeholder.value) {
    prerenderStaticImages(placeholder.value, undefined, useRequestEvent())
  }
}

const nuxtApp = useNuxtApp()
const initialLoad = nuxtApp.isHydrating

const imgEl = useTemplateRef('imgEl')

function setAttributes(el: Element, attrs: Record<string, string | undefined>) {
  for (const key in attrs) {
    if (attrs[key]) {
      el.setAttribute(key, attrs[key])
    }
  }
}

// Loads the real image off-screen, using the same `<source>` candidates as the
// final markup so the browser picks the format and size it would pick anyway.
function loadSources() {
  const picture = document.createElement('picture')
  const img = document.createElement('img')

  for (const { type, sizes, srcset } of sources.value.slice(0, -1)) {
    const source = document.createElement('source')
    setAttributes(source, { type, sizes, srcset })
    picture.appendChild(source)
  }
  picture.appendChild(img)

  img.onload = (event) => {
    // img.decode() avoids jank and flash. A failed decode should not keep the placeholder forever
    Promise.resolve(img.decode?.()).catch(() => {}).then(() => {
      placeholderLoaded.value = true
      emit('load', event)
    })
  }
  img.onerror = (event) => {
    emit('error', event)
  }

  // Attributes are set last, once the `<img>` is a child of the `<picture>`
  const { sizes, srcset, src } = sources.value.at(-1)!
  setAttributes(img, { sizes, srcset, src, crossorigin: normalizedAttrs.value.crossorigin })
}

onMounted(() => {
  if (placeholder.value) {
    loadSources()
    markFeatureUsage('nuxt-picture')
    return
  }

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
