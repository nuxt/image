import { computed } from 'vue'
import type { ExtractPropTypes, ImgHTMLAttributes } from 'vue'
import { parseSize } from '../utils'
import { useImage } from '#imports'

export const baseImageProps = {
  // input source
  src: { type: String, required: false },

  // modifiers
  format: { type: String, required: false },
  quality: { type: [Number, String], required: false },
  background: { type: String, required: false },
  fit: { type: String, required: false },
  modifiers: { type: Object as () => Record<string, any>, required: false },

  // options
  preset: { type: String, required: false },
  provider: { type: String, required: false },

  sizes: { type: [Object, String] as unknown as () => string | Record<string, any>, required: false },
  densities: { type: String, required: false },
  preload: {
    type: [Boolean, Object] as unknown as () => boolean | {
      fetchPriority: 'auto' | 'high' | 'low'
    },
    required: false,
  },

  // <img> attributes
  width: { type: [String, Number], required: false },
  height: { type: [String, Number], required: false },
  alt: { type: String, required: false },
  referrerpolicy: { type: String as unknown as () => ImgHTMLAttributes['referrerpolicy'], required: false },
  usemap: { type: String, required: false },
  longdesc: { type: String, required: false },
  ismap: { type: Boolean, required: false },
  loading: {
    type: String as () => 'lazy' | 'eager',
    required: false,
    validator: (val: any) => ['lazy', 'eager'].includes(val),
  },
  crossorigin: {
    type: [Boolean, String] as unknown as () => 'anonymous' | 'use-credentials' | boolean,
    required: false,
    validator: (val: any) => ['anonymous', 'use-credentials', '', true, false].includes(val),
  },
  decoding: {
    type: String as () => 'async' | 'auto' | 'sync',
    required: false,
    validator: (val: any) => ['async', 'auto', 'sync'].includes(val),
  },

  // csp
  nonce: { type: [String], required: false },
}

export interface BaseImageAttrs {
  width?: number
  height?: number
  alt?: string
  referrerpolicy?: ImgHTMLAttributes['referrerpolicy']
  usemap?: string
  longdesc?: string
  ismap?: boolean
  crossorigin?: '' | 'anonymous' | 'use-credentials'
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'auto' | 'sync'
  nonce?: string
}

export interface BaseImageModifiers {
  width?: number
  height?: number
  format?: string
  quality?: string | number
  background?: string
  fit?: string
  [key: string]: any
}

export const useBaseImage = (props: ExtractPropTypes<typeof baseImageProps>) => {
  const options = computed(() => {
    return {
      provider: props.provider,
      preset: props.preset,
    }
  })

  const attrs = computed<BaseImageAttrs>(() => {
    return <BaseImageAttrs> {
      width: parseSize(props.width),
      height: parseSize(props.height),
      alt: props.alt,
      referrerpolicy: props.referrerpolicy,
      usemap: props.usemap,
      longdesc: props.longdesc,
      ismap: props.ismap,
      crossorigin: props.crossorigin === true ? 'anonymous' : props.crossorigin || undefined,
      loading: props.loading,
      decoding: props.decoding,
      nonce: props.nonce,
    }
  })

  const $img = useImage()

  const modifiers = computed<BaseImageModifiers>(() => {
    return <BaseImageModifiers> {
      ...props.modifiers,
      width: parseSize(props.width),
      height: parseSize(props.height),
      format: props.format,
      quality: props.quality || $img.options.quality,
      background: props.background,
      fit: props.fit,
    }
  })

  return {
    options,
    attrs,
    modifiers,
  }
}

export const pictureProps = {
  ...baseImageProps,
  legacyFormat: { type: String, default: null },
  imgAttrs: { type: Object, default: null },
}

export const imgProps = {
  ...baseImageProps,
  placeholder: { type: [Boolean, String, Number, Array], required: false },
  placeholderClass: { type: String, required: false },
}
