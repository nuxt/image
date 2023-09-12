import { computed } from 'vue'
import type { ExtractPropTypes } from 'vue'
import { parseSize } from '../utils'
import { useImage } from '#imports'

export const baseImageProps = {
  // input source
  src: { type: String, required: true },

  // modifiers
  format: { type: String, default: undefined },
  quality: { type: [Number, String], default: undefined },
  background: { type: String, default: undefined },
  fit: { type: String, default: undefined },
  modifiers: { type: Object as () => Record<string, any>, default: undefined },

  // options
  preset: { type: String, default: undefined },
  provider: { type: String, default: undefined },

  sizes: { type: [Object, String] as unknown as () => string | Record<string, any>, default: undefined },
  densities: { type: String, default: undefined },
  preload: { type: Boolean, default: undefined },

  // <img> attributes
  width: { type: [String, Number], default: undefined },
  height: { type: [String, Number], default: undefined },
  alt: { type: String, default: undefined },
  referrerpolicy: { type: String, default: undefined },
  usemap: { type: String, default: undefined },
  longdesc: { type: String, default: undefined },
  ismap: { type: Boolean, default: undefined },
  loading: { type: String, default: undefined },
  crossorigin: {
    type: [Boolean, String] as unknown as () => 'anonymous' | 'use-credentials' | boolean,
    default: undefined,
    validator: (val: any) => ['anonymous', 'use-credentials', '', true, false].includes(val)
  },
  decoding: {
    type: String as () => 'async' | 'auto' | 'sync',
    default: undefined,
    validator: (val: any) => ['async', 'auto', 'sync'].includes(val)
  }
}

export const basePictureProps = {
  ...baseImageProps,
  format: { type: [String, Array] as unknown as () => string | string[], default: undefined }
}

export interface BaseImageAttrs {
  width?: number
  height?: number
  alt?: string
  referrerpolicy?: string
  usemap?: string
  longdesc?: string
  ismap?: boolean
  crossorigin?: '' | 'anonymous' | 'use-credentials'
  loading?: string
  decoding?: 'async' | 'auto' | 'sync'
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

export interface BasePictureModifiers extends Omit<BaseImageModifiers, 'format'> {
  format?: string | string[];
}

export const useBaseImage = (props: ExtractPropTypes<typeof baseImageProps>) => {
  const options = computed(() => {
    return {
      provider: props.provider,
      preset: props.preset
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
      decoding: props.decoding
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
      fit: props.fit
    }
  })

  return {
    options,
    attrs,
    modifiers
  }
}


export const useBasePicture = (props: ExtractPropTypes<typeof basePictureProps>) => {
  const options = computed(() => {
    return {
      provider: props.provider,
      preset: props.preset
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
      decoding: props.decoding
    }
  })

  const $img = useImage()

  const modifiers = computed<BasePictureModifiers>(() => {
    return <BasePictureModifiers> {
      ...props.modifiers,
      width: parseSize(props.width),
      height: parseSize(props.height),
      format: props.format,
      quality: props.quality || $img.options.quality,
      background: props.background,
      fit: props.fit
    }
  })

  return {
    options,
    attrs,
    modifiers
  }
}