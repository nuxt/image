import { computed } from 'vue'
import type { ConfiguredImageProviders, ImageModifiers } from '@nuxt/image'
import { parseSize } from '../utils'
import { useImage } from '#imports'

export interface BaseImageProps<Provider extends keyof ConfiguredImageProviders> {
  // input source
  src?: string

  // modifiers
  format?: string
  quality?: string | number
  background?: string
  fit?: string
  modifiers?: Partial<Omit<ImageModifiers, 'format' | 'quality' | 'background' | 'fit'>> &
    ('modifiers' extends keyof ConfiguredImageProviders[Provider] ? ConfiguredImageProviders[Provider]['modifiers'] : Record<string, unknown>)

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

export const useProviderOptions = <Provider extends keyof ConfiguredImageProviders>(props: Pick<BaseImageProps<Provider>, 'provider' | 'preset'>) => computed(() => {
  return {
    provider: props.provider,
    preset: props.preset,
  }
})

export const useNormalisedAttrs = (props: Pick<BaseImageProps<any>, 'width' | 'height' | 'crossorigin' | 'nonce'>) => computed(() => {
  return {
    width: parseSize(props.width),
    height: parseSize(props.height),
    crossorigin: props.crossorigin === true ? 'anonymous' : props.crossorigin || undefined,
    nonce: props.nonce,
  }
})

export const useImageModifiers = (props: Pick<BaseImageProps<any>, 'width' | 'height' | 'modifiers' | 'format' | 'quality' | 'fit' | 'background'>) => {
  const $img = useImage()

  return computed(() => {
    return {
      ...props.modifiers,
      width: parseSize(props.width),
      height: parseSize(props.height),
      format: props.format,
      quality: props.quality || $img.options.quality,
      background: props.background,
      fit: props.fit,
    }
  })
}
