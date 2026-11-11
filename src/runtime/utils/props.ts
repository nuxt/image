import { computed } from 'vue'

import type { ConfiguredImageProviders, ImageModifiers } from '@nuxt/image'
import { parseSize } from '.'
import { useImage } from '#imports'

export interface BaseImageProps<Provider extends keyof ConfiguredImageProviders> {
  // input source
  src?: string

  // modifiers
  format?: string
  quality?: string | number
  background?: string
  fit?: string
  modifiers?: Partial<Omit<ImageModifiers, 'format' | 'quality' | 'background' | 'fit'>>
    & ('modifiers' extends keyof ConfiguredImageProviders[Provider] ? ConfiguredImageProviders[Provider]['modifiers'] : Record<string, unknown>)

  // options
  preset?: string
  provider?: Provider

  sizes?: string | Record<string, any>
  densities?: string
  preload?: boolean | { fetchPriority: 'auto' | 'high' | 'low' }

  // <img> attributes
  width?: string | number
  height?: string | number
  crossorigin?: 'anonymous' | 'use-credentials' | boolean

  // csp
  nonce?: string
}

export type PlaceholderProp = boolean | string | number | [w: number, h: number, q?: number, b?: number]

/**
 * Resolves the `placeholder` prop into either a ready-to-use URL (when a string
 * is provided), the modifiers used to generate a low quality placeholder, or
 * `false` when no placeholder should be rendered.
 */
export const resolvePlaceholder = (placeholder: PlaceholderProp | undefined) => {
  const value = placeholder === '' ? [10, 10] : placeholder

  if (!value) {
    return false
  }

  if (typeof value === 'string') {
    return value
  }

  const [width = 10, height = width, quality = 50, blur = 3] = Array.isArray(value)
    ? value
    : typeof value === 'number' ? [value] : []

  return { width, height, quality, blur }
}

export const useImageProps = <Provider extends keyof ConfiguredImageProviders>(props: BaseImageProps<Provider>) => {
  const $img = useImage()

  const providerOptions = computed(() => ({
    provider: props.provider,
    preset: props.preset,
  }))

  const normalizedAttrs = computed(() => ({
    width: parseSize(props.width),
    height: parseSize(props.height),
    crossorigin: props.crossorigin === true ? 'anonymous' : props.crossorigin || undefined,
    nonce: props.nonce,
  }))

  const imageModifiers = computed(() => {
    return {
      ...props.modifiers,
      width: props.width,
      height: props.height,
      format: props.format,
      quality: props.quality || $img.options.quality,
      background: props.background,
      fit: props.fit,
    } satisfies Partial<ImageModifiers>
  })

  return { providerOptions, normalizedAttrs, imageModifiers }
}
