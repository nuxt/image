import { defu } from 'defu'
import { hasProtocol, parseURL, joinURL, withLeadingSlash } from 'ufo'
import type { ImageOptions, ImageSizesOptions, CreateImageOptions, ResolvedImage, ImageCTX, $Img, ImageSizes, ImageSizesVariant } from '../module'
import { imageMeta } from './utils/meta'
import { checkDensities, parseDensities, parseSize, parseSizes } from './utils'
import { prerenderStaticImages } from './utils/prerender'

export function createImage(globalOptions: CreateImageOptions) {
  const ctx: ImageCTX = {
    options: globalOptions,
  }

  const getImage: $Img['getImage'] = (input: string, options = {}) => {
    const image = resolveImage(ctx, input, options)

    // Prerender static images
    if (import.meta.server && process.env.prerender) {
      prerenderStaticImages(image.url)
    }

    return image
  }

  const $img = ((input, modifiers = {}, options = {}) => {
    return getImage(input, {
      ...options,
      modifiers: defu(modifiers, options.modifiers || {}),
    }).url
  }) as $Img

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

async function getMeta(ctx: ImageCTX, input: string, options?: ImageOptions) {
  const image = resolveImage(ctx, input, { ...options })

  if (typeof image.getMeta === 'function') {
    return await image.getMeta()
  }
  else {
    return await imageMeta(ctx, image.url)
  }
}

function resolveImage(ctx: ImageCTX, input: string, options: ImageOptions): ResolvedImage {
  if (input && typeof input !== 'string') {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`)
  }

  if (!input || input.startsWith('data:')) {
    return {
      url: input,
    }
  }

  const { provider, defaults } = getProvider(ctx, options.provider || ctx.options.provider)
  const preset = getPreset(ctx, options.preset)

  // Normalize input with leading slash
  input = hasProtocol(input) ? input : withLeadingSlash(input)

  // Resolve alias if provider is not ipx
  if (!provider.supportsAlias) {
    for (const base in ctx.options.alias) {
      if (input.startsWith(base)) {
        input = joinURL(ctx.options.alias[base], input.substr(base.length))
      }
    }
  }

  // Externalize remote images if domain does not match with `domains`
  if (provider.validateDomains && hasProtocol(input)) {
    const inputHost = parseURL(input).host
    // Domains are normalized to hostname in module
    if (!ctx.options.domains.find(d => d === inputHost)) {
      return {
        url: input,
      }
    }
  }

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

function getProvider(ctx: ImageCTX, name: string): ImageCTX['options']['providers'][0] {
  const provider = ctx.options.providers[name]
  if (!provider) {
    throw new Error('Unknown provider: ' + name)
  }
  return provider
}

function getPreset(ctx: ImageCTX, name?: string): ImageOptions {
  if (!name) {
    return {}
  }
  if (!ctx.options.presets[name]) {
    throw new Error('Unknown preset: ' + name)
  }
  return ctx.options.presets[name]
}

function getSizes(ctx: ImageCTX, input: string, opts: ImageSizesOptions): ImageSizes {
  const width = parseSize(opts.modifiers?.width)
  const height = parseSize(opts.modifiers?.height)
  const sizes = parseSizes(opts.sizes)
  const densities = opts.densities?.trim() ? parseDensities(opts.densities.trim()) : ctx.options.densities
  checkDensities(densities)

  const hwRatio = (width && height) ? height / width : 0
  const sizeVariants = []
  const srcsetVariants = []

  if (Object.keys(sizes).length >= 1) {
    // 'sizes path'
    for (const key in sizes) {
      const variant = getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx)
      if (variant === undefined) {
        continue
      }

      // add size variant with 'media'
      sizeVariants.push({
        size: variant.size,
        screenMaxWidth: variant.screenMaxWidth,
        media: `(max-width: ${variant.screenMaxWidth}px)`,
      })

      // add srcset variants for all densities (for current 'size' processed)
      for (const density of densities) {
        srcsetVariants.push({
          width: variant._cWidth * density,
          src: getVariantSrc(ctx, input, opts, variant, density),
        })
      }
    }

    finaliseSizeVariants(sizeVariants)
  }
  else {
    // 'densities path'
    for (const density of densities) {
      const key = Object.keys(sizes)[0]
      let variant = getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx)

      // unable to resolve variant, fallback to default modifiers
      if (variant === undefined) {
        variant = {
          size: '',
          screenMaxWidth: 0,
          _cWidth: opts.modifiers?.width as number,
          _cHeight: opts.modifiers?.height as number,
        }
      }

      srcsetVariants.push({
        width: density,
        src: getVariantSrc(ctx, input, opts, variant, density),
      })
    }
  }

  finaliseSrcsetVariants(srcsetVariants)

  // use last (:= largest) srcset variant as the image `src`
  const defaultVariant = srcsetVariants[srcsetVariants.length - 1]

  const sizesVal = sizeVariants.length ? sizeVariants.map(v => `${v.media ? v.media + ' ' : ''}${v.size}`).join(', ') : undefined
  const suffix = sizesVal ? 'w' : 'x'
  const srcsetVal = srcsetVariants.map(v => `${v.src} ${v.width}${suffix}`).join(', ')

  return {
    sizes: sizesVal,
    srcset: srcsetVal,
    src: defaultVariant?.src,
  }
}

function getSizesVariant(key: string, size: string, height: number | undefined, hwRatio: number, ctx: ImageCTX): ImageSizesVariant | undefined {
  const screenMaxWidth = (ctx.options.screens && ctx.options.screens[key]) || Number.parseInt(key)
  const isFluid = size.endsWith('vw')
  if (!isFluid && /^\d+$/.test(size)) {
    size = size + 'px'
  }
  if (!isFluid && !size.endsWith('px')) {
    return undefined
  }
  let _cWidth = Number.parseInt(size)
  if (!screenMaxWidth || !_cWidth) {
    return undefined
  }
  if (isFluid) {
    _cWidth = Math.round((_cWidth / 100) * screenMaxWidth)
  }
  const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height
  return {
    size,
    screenMaxWidth,
    _cWidth,
    _cHeight,
  }
}

function getVariantSrc(ctx: ImageCTX, input: string, opts: ImageSizesOptions, variant: ImageSizesVariant, density: number) {
  return ctx.$img!(input,
    {
      ...opts.modifiers,
      width: variant._cWidth ? variant._cWidth * density : undefined,
      height: variant._cHeight ? variant._cHeight * density : undefined,
    },
    opts)
}

function finaliseSizeVariants(sizeVariants: any[]) {
  sizeVariants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth)

  // de-duplicate size variants (by key `media`)
  let previousMedia = null
  for (let i = sizeVariants.length - 1; i >= 0; i--) {
    const sizeVariant = sizeVariants[i]
    if (sizeVariant.media === previousMedia) {
      sizeVariants.splice(i, 1)
    }
    previousMedia = sizeVariant.media
  }

  for (let i = 0; i < sizeVariants.length; i++) {
    sizeVariants[i].media = sizeVariants[i + 1]?.media || ''
  }
}

function finaliseSrcsetVariants(srcsetVariants: any[]) {
  // sort by width
  srcsetVariants.sort((v1, v2) => v1.width - v2.width)

  // de-duplicate srcset variants (by key `width`)
  let previousWidth = null
  for (let i = srcsetVariants.length - 1; i >= 0; i--) {
    const sizeVariant = srcsetVariants[i]
    if (sizeVariant.width === previousWidth) {
      srcsetVariants.splice(i, 1)
    }
    previousWidth = sizeVariant.width
  }
}
