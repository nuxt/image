import defu from 'defu'
import { joinURL } from 'ufo'
import type { ImageOptions, ImageSizesOptions, CreateImageOptions, ResolvedImage, MapToStatic, ImageCTX, $Img } from '../types/image'
import { imageMeta } from './utils/meta'
import { parseSize } from './utils'
import { useStaticImageMap } from './utils/static-map'

export function createImage (globalOptions: CreateImageOptions, nuxtContext) {
  const staticImageManifest = (process.client && process.static) ? useStaticImageMap(nuxtContext) : {}

  const ctx: ImageCTX = {
    options: globalOptions,
    nuxtContext
  }

  const getImage: $Img['getImage'] = function (input: string, options: ImageOptions = {}) {
    const image = resolveImage(ctx, input, options)
    if (image.isStatic) {
      handleStaticImage(image, input)
    }
    return image
  }

  function $img (input: string, modifiers: ImageOptions['modifiers'] = {}, options: ImageOptions = {}) {
    return getImage(input, {
      ...options,
      modifiers: {
        ...options.modifiers,
        ...modifiers
      }
    }).url
  }

  function handleStaticImage (image: ResolvedImage, input: string) {
    if (process.static) {
      const staticImagesBase = '/_nuxt/image' // TODO

      if (process.client && 'fetchPayload' in window.$nuxt) {
        const mappedURL = staticImageManifest[image.url]
        image.url = mappedURL ? joinURL(staticImagesBase, mappedURL) : input
        return image
      }

      if (process.server) {
        const { ssrContext } = ctx.nuxtContext
        const ssrData = ssrContext.nuxt.data[0]
        const staticImages = ssrData._img = ssrData._img || {}
        const mapToStatic: MapToStatic = ssrContext.image?.mapToStatic
        if (typeof mapToStatic === 'function') {
          const mappedURL = mapToStatic(image)
          if (mappedURL) {
            staticImages[image.url] = mappedURL
            image.url = joinURL(staticImagesBase, mappedURL)
          }
        }
      }
    } else if (process.env.NODE_ENV === 'production') {
      image.url = input
    }
  }

  for (const presetName in globalOptions.presets) {
    $img[presetName] = ((source, modifiers, options) =>
      $img(source, modifiers, { ...globalOptions.presets[presetName], ...options })) as $Img[string]
  }

  $img.options = globalOptions
  $img.getImage = getImage
  $img.getMeta = ((input: string, options?: ImageOptions) => getMeta(ctx, input, options)) as $Img['getMeta']
  $img.getSizes = ((input: string, options: ImageSizesOptions) => getSizes(ctx, input, options)) as $Img['getSizes']

  ctx.$img = $img as $Img

  return $img
}

async function getMeta (ctx: ImageCTX, input: string, options: ImageOptions) {
  const image = resolveImage(ctx, input, { ...options })

  const meta = {}

  if (typeof image.getMeta === 'function') {
    Object.assign(meta, await image.getMeta())
  } else {
    Object.assign(meta, await imageMeta(ctx, image.url))
  }

  return meta
}

function resolveImage (ctx: ImageCTX, input: string, options: ImageOptions): ResolvedImage {
  if (typeof input !== 'string') {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`)
  }

  if (input.startsWith('data:')) {
    return {
      url: input
    }
  }

  const { provider, defaults } = getProvider(ctx, options.provider || ctx.options.provider)
  const preset = getPreset(ctx, options.preset)

  const _options: ImageOptions = defu(options, preset, defaults)
  _options.modifiers = { ..._options.modifiers }
  const expectedFormat = _options.modifiers.format

  if (_options.modifiers?.width) {
    _options.modifiers.width = parseSize(_options.modifiers.width)
  }
  if (_options.modifiers?.height) {
    _options.modifiers.height = parseSize(_options.modifiers.height)
  }

  const image = provider.getImage(input, _options, ctx)

  image.format = image.format || expectedFormat || ''

  return image
}

function getProvider (ctx: ImageCTX, name: string): ImageCTX['options']['providers'][0] {
  const provider = ctx.options.providers[name]
  if (!provider) {
    throw new Error('Unknown provider: ' + name)
  }
  return provider
}

function getPreset (ctx: ImageCTX, name?: string): ImageOptions {
  if (!name) {
    return {}
  }
  if (!ctx.options.presets[name]) {
    throw new Error('Unknown preset: ' + name)
  }
  return ctx.options.presets[name]
}

function getSizes (ctx: ImageCTX, input: string, opts: ImageSizesOptions) {
  const ratio = parseSize(opts.modifiers.height) / parseSize(opts.modifiers.width)
  const sizeVariants = []
  const srcVariants = []

  const sizes: Record<string, string> = {}
  const srcset: Array<number> = []

  // string => object
  if (typeof opts.sizes === 'string') {
    for (const entry of opts.sizes.split(/[\s,]+/).filter(e => e)) {
      const s = entry.split(':')
      if (s.length !== 2) { continue }
      sizes[s[0].trim()] = s[1].trim()
    }
  } else {
    Object.assign(sizes, opts.sizes)
  }

  for (const key in sizes) {
    const screenMaxWidth = ctx.options.screens[key] || parseInt(key)
    let size = String(sizes[key])
    const isFluid = size.endsWith('vw')
    if (!isFluid && /^\d+$/.test(size)) {
      size = size + 'px'
    }
    if (!isFluid && !size.endsWith('px')) {
      continue
    }
    let width = parseInt(size)
    if (!screenMaxWidth || !width) {
      continue
    }
    if (isFluid) {
      width = Math.round((width / 100) * screenMaxWidth)
    }
    const height = ratio ? Math.round(width * ratio) : parseSize(opts.modifiers.height)
    sizeVariants.push({
      width,
      size,
      screenMaxWidth,
      media: `(max-width: ${screenMaxWidth}px)`,
      src: ctx.$img(input, { ...opts.modifiers, width, height }, opts)
    })
  }

  sizeVariants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth)

  const defaultVar = sizeVariants[sizeVariants.length - 1]
  if (defaultVar) {
    defaultVar.media = ''
  }

  // Only use srcset if it is a string
  if (typeof opts.srcset === 'string') {
    for (const entry of opts.srcset.split(/[ ,]+/).filter(e => e)) {
      if (/^[x]\d\b/.test(entry)) {
        const dpiSize = parseInt(entry.replace(/^x/, ''))
        if (isNaN(dpiSize) || !opts.sizes) {
          continue
        }
        srcset.push(...sizeVariants.map(s => s.width * dpiSize))
      } else {
        const size = parseInt(entry)
        if (isNaN(size)) {
          continue
        }
        srcset.push(size)
      }
    }
  }

  const uniqueSrcset = Array.from(new Set(srcset))

  uniqueSrcset.forEach((width) => {
    const height = ratio ? Math.round(width * ratio) : parseSize(opts.modifiers.height)
    srcVariants.push({
      width,
      src: ctx.$img(input, { ...opts.modifiers, width, height }, opts)
    })
  })

  srcVariants.sort((v1, v2) => v1.width - v2.width)

  return {
    sizes: sizeVariants.map(v => `${v.media ? v.media + ' ' : ''}${v.size}`).join(', '),
    srcset: srcVariants.length ? srcVariants.map(v => `${v.src} ${v.width}w`).join(', ') : sizeVariants.map(v => `${v.src} ${v.width}w`).join(', '),
    src: defaultVar?.src
  }
}
