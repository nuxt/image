import { defu } from 'defu'
import { hasProtocol, parseURL, joinURL, withLeadingSlash } from 'ufo'
import type { ImageOptions, ImageSizesOptions, CreateImageOptions, ResolvedImage, ImageCTX, $Img } from '../types/image'
import { imageMeta } from './utils/meta'
import { parseDensities, parseSize } from './utils'
import { prerenderStaticImages } from './utils/prerender'

export function createImage (globalOptions: CreateImageOptions) {
  const ctx: ImageCTX = {
    options: globalOptions
  }

  const getImage: $Img['getImage'] = (input: string, options = {}) => {
    const image = resolveImage(ctx, input, options)

    // Prerender static images
    if (process.server && process.env.prerender) {
      prerenderStaticImages(image.url)
    }

    return image
  }

  const $img = ((input, modifiers = {}, options = {}) => {
    return getImage(input, {
      ...options,
      modifiers: defu(modifiers, options.modifiers || {})
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
  $img.getDensitySet = ((input: string, options: ImageSizesOptions) => getDensitySet(ctx, input, options)) as $Img['getDensitySet']

  ctx.$img = $img as $Img

  return $img
}

async function getMeta (ctx: ImageCTX, input: string, options?: ImageOptions) {
  const image = resolveImage(ctx, input, { ...options })

  if (typeof image.getMeta === 'function') {
    return await image.getMeta()
  } else {
    return await imageMeta(ctx, image.url)
  }
}

function resolveImage (ctx: ImageCTX, input: string, options: ImageOptions): ResolvedImage {
  if (typeof input !== 'string' || input === '') {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`)
  }

  if (input.startsWith('data:')) {
    return {
      url: input
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
        url: input
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
  const width = parseSize(opts.modifiers?.width)
  const height = parseSize(opts.modifiers?.height)
  const densities = opts.densities ? parseDensities(opts.densities) : ctx.options.densities

  const hwRatio = (width && height) ? height / width : 0
  const sizeVariants = []
  const srcsetVariants = []

  const sizes: Record<string, string> = {}

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
    const screenMaxWidth = (ctx.options.screens && ctx.options.screens[key]) || parseInt(key)
    let size = String(sizes[key])
    const isFluid = size.endsWith('vw')
    if (!isFluid && /^\d+$/.test(size)) {
      size = size + 'px'
    }
    if (!isFluid && !size.endsWith('px')) {
      continue
    }
    let _cWidth = parseInt(size)
    if (!screenMaxWidth || !_cWidth) {
      continue
    }
    if (isFluid) {
      _cWidth = Math.round((_cWidth / 100) * screenMaxWidth)
    }
    const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height

    // add size variant with 'media'
    sizeVariants.push({
      size,
      screenMaxWidth,
      media: `(max-width: ${screenMaxWidth}px)`
    })

    if (densities) {
      // add srcset variants for all densities (for current 'size' processed)
      for (const density of densities) {
        srcsetVariants.push({
          width: _cWidth * density,
          src: ctx.$img!(input, { ...opts.modifiers, width: _cWidth * density, height: _cHeight ? _cHeight * density : undefined }, opts)
        })
      }
    }
  }

  sizeVariants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth)

  // for last size variant, always remove `media` (convention)
  if (sizeVariants[sizeVariants.length - 1]) {
    sizeVariants[sizeVariants.length - 1].media = ''
  }

  // de-duplicate size variants (by key `media`)
  let previousMedia = null
  for (let i = sizeVariants.length - 1; i >= 0; i--) {
    const sizeVariant = sizeVariants[i]
    if (sizeVariant.media === previousMedia) {
      sizeVariants.splice(i, 1)
    }
    previousMedia = sizeVariant.media
  }

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

  // use last (:= largest) srcset variant as the image `src`
  const defaultVar = srcsetVariants[srcsetVariants.length - 1]

  return {
    sizes: sizeVariants.map(v => `${v.media ? v.media + ' ' : ''}${v.size}`).join(', '),
    srcset: srcsetVariants.map(v => `${v.src} ${v.width}w`).join(', '),
    src: defaultVar.src
  }
}

function getDensitySet (ctx: ImageCTX, input: string, opts: ImageSizesOptions): string|undefined {
  const densities = opts.densities ? parseDensities(opts.densities) : ctx.options.densities
  if (densities.length === 0) {
    return undefined
  }

  const srcsetVariants :{ density: string, src: string }[] = []

  for (const density of densities) {
    const modifiers = { ...opts.modifiers }
    if (modifiers.width) {
      modifiers.width = modifiers.width * density
    }
    if (modifiers.height) {
      modifiers.height = modifiers.height * density
    }
    srcsetVariants.push({
      density: `${density}x`,
      src: ctx.$img!(input, modifiers, opts)
    })
  }

  return srcsetVariants.map(v => `${v.src} ${v.density}`).join(', ')
}
