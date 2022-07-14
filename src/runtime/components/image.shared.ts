import { computed } from 'vue'
import type { ExtractPropTypes } from 'vue'
import { parseSize } from '../utils'
import { useImage } from '../composables'
import { getFileExtension } from '#image'

const shared = {
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
  preload: { type: Boolean, default: undefined },

  // <img> attributes
  width: { type: [String, Number], default: undefined },
  height: { type: [String, Number], default: undefined },
  alt: { type: String, default: undefined },
  referrerpolicy: { type: String, default: undefined },
  usemap: { type: String, default: undefined },
  longdesc: { type: String, default: undefined },
  ismap: { type: Boolean, default: undefined },
  crossorigin: { type: [Boolean, String] as unknown as () => boolean | '' | 'anonymous' | 'use-credentials', default: undefined, validator: val => ['anonymous', 'use-credentials', '', true, false].includes(val) },
  loading: { type: String, default: undefined },
  decoding: { type: String as () => 'async' | 'auto' | 'sync', default: undefined, validator: val => ['async', 'auto', 'sync'].includes(val) }
}

export const imgProps = {
  ...shared,
  placeholder: { type: [Boolean, String, Number, Array], default: undefined }
}

export const pictureProps = {
  ...shared,
  legacyFormat: { type: String, default: null },
  imgAttrs: { type: Object, default: null }
}

type ImgProps = ExtractPropTypes<typeof imgProps>
type PictureProps = ExtractPropTypes<typeof pictureProps>

const useShared = (props: ImgProps | PictureProps) => {
  const nOptions = computed(() => {
    return {
      provider: props.provider,
      preset: props.preset
    }
  })

  const nImgAttrs = computed<{
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
    }>(() => {
      return {
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

  const nModifiers = computed<{ width?: number, height?: number, format?: string, quality?: string | number, background?: string, fit?: string } & Record<string, any>>(() => {
    return {
      ...props.modifiers,
      width: parseSize(props.width),
      height: parseSize(props.height),
      format: props.format,
      quality: props.quality,
      background: props.background,
      fit: props.fit
    }
  })

  return { nOptions, nImgAttrs, nModifiers }
}

export const prepareNuxtImg = (props: Partial<ImgProps>) => {
  const $img = useImage()

  const { nOptions, nImgAttrs, nModifiers } = useShared(props)

  const placeholderLoaded = ref(false)

  const nAttrs = computed(() => {
    const attrs: typeof nImgAttrs.value & {
      sizes?: string
      srcset?: string
    } = nImgAttrs.value

    if (props.sizes) {
      const { sizes, srcset } = nSizes.value
      attrs.sizes = sizes
      attrs.srcset = srcset
    }
    return attrs
  })

  const nMainSrc = computed(() => props.sizes ? nSizes.value.src : $img.generate(props.src, nModifiers.value, nOptions.value))

  const nSizes = computed(() => $img.getSizes(props.src, {
    ...nOptions.value,
    sizes: props.sizes,
    modifiers: {
      ...nModifiers.value,
      width: parseSize(props.width),
      height: parseSize(props.height)
    }
  }))

  const nSrc = computed(() => nPlaceholder.value ? nPlaceholder.value : nMainSrc.value)

  const nPlaceholder = computed(() => {
    let placeholder = props.placeholder
    if (placeholder === '') { placeholder = true }
    if (!placeholder || placeholderLoaded.value) { return false }
    if (typeof placeholder === 'string') { return placeholder }

    const size = (Array.isArray(placeholder)
      ? placeholder
      : (typeof placeholder === 'number' ? [placeholder, placeholder] : [10, 10])) as [w: number, h: number, q: number]

    return $img.generate(props.src, {
      ...nModifiers.value,
      width: size[0],
      height: size[1],
      quality: size[2] || 50
    }, nOptions.value)
  })

  return { nAttrs, nMainSrc, nSrc, nPlaceholder, placeholderLoaded }
}

export const prepareNuxtPicture = (props: Partial<PictureProps>) => {
  const $img = useImage()

  const { nOptions, nImgAttrs, nModifiers } = useShared(props)

  const isTransparent = computed(() => ['png', 'webp', 'gif'].includes(originalFormat.value))

  const originalFormat = computed(() => getFileExtension(props.src))

  const nFormat = computed(() => props.format || originalFormat.value === 'svg' ? 'svg' : 'webp')

  const nLegacyFormat = computed(() => {
    if (props.legacyFormat) { return props.legacyFormat }
    const formats: Record<string, string> = {
      webp: isTransparent.value ? 'png' : 'jpeg',
      svg: 'png'
    }
    return formats[nFormat.value] || originalFormat.value
  })

  const nSources = computed<Array<{ srcset: string, src?: string, type?: string, sizes?: string }>>(() => {
    if (nFormat.value === 'svg') {
      return [{ srcset: props.src }]
    }

    const formats = nLegacyFormat.value !== nFormat.value
      ? [nLegacyFormat.value, nFormat.value]
      : [nFormat.value]

    return formats.map((format) => {
      const { srcset, sizes, src } = $img.getSizes(props.src, {
        ...nOptions.value,
        sizes: props.sizes || $img.options.screens,
        modifiers: { ...nModifiers.value, format }
      })

      return { src, type: `image/${format}`, sizes, srcset }
    })
  })

  return { nSources, nImgAttrs }
}
