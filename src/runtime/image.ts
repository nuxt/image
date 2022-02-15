import defu from 'defu'
import { hasProtocol, parseURL, joinURL, withLeadingSlash } from 'ufo'
import type { ImageOptions, ImageSizesOptions, CreateImageOptions, ResolvedImage, MapToStatic, ImageCTX, $Img } from '../types/image'
import { imageMeta } from './utils/meta'
import { parseSize } from './utils'
import { useStaticImageMap } from './utils/static-map'

export function createImage (globalOptions: CreateImageOptions, nuxtContext: any) {
  const staticImageManifest: Record<string, string> = (process.client && process.static) ? useStaticImageMap(nuxtContext) : {}

  const ctx: ImageCTX = {
    options: globalOptions,
    nuxtContext
  }

  const getImage: $Img['getImage'] = function (input: string, options = {}) {
    const image = resolveImage(ctx, input, options)
    if (image.isStatic) {
      handleStaticImage(image, input)
    }
    return image
  }

  const $img = function $img (input, modifiers = {}, options = {}) {
    return getImage(input, {
      ...options,
      modifiers: defu(modifiers, options.modifiers || {})
    }).url
  } as $Img

  function handleStaticImage (image: ResolvedImage, input: string) {
    if (process.static) {
      if (process.client && 'fetchPayload' in window.$nuxt) {
        const mappedURL = staticImageManifest[image.url]
        image.url = mappedURL || input
        return image
      }

      if (process.server) {
        const { ssrContext } = ctx.nuxtContext
        if (ssrContext) {
          const ssrState = ssrContext.nuxt || {}
          const staticImages = ssrState._img = ssrState._img || {}
          const ssrData = ssrState.data?.[0]
          if (ssrData) {
            ssrData._img = staticImages
          }
          const mapToStatic: MapToStatic = ssrContext.image?.mapToStatic
          if (typeof mapToStatic === 'function') {
            const mappedURL = mapToStatic(image, input)
            if (mappedURL) {
              staticImages[image.url] = mappedURL
              image.url = mappedURL
            }
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
  const hwRatio = (width && height) ? height / width : 0
  const variants = []

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

  const { mobileFirst } = ctx.options
  for (const key in sizes) {
    const screenWidth = (ctx.options.screens && ctx.options.screens[key]) || parseInt(key)
    let size = String(sizes[key])
    const isFluid = size.endsWith('vw')
    if (!isFluid && /^\d+$/.test(size)) {
      size = size + 'px'
    }
    if (!isFluid && !size.endsWith('px')) {
      continue
    }
    let _cWidth = parseInt(size)
    if (!screenWidth || !_cWidth) {
      continue
    }
    if (isFluid) {
      _cWidth = Math.round((_cWidth / 100) * screenWidth)
    }
    const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height
    variants.push({
      width: _cWidth,
      size,
      screenWidth,
      media: `(${mobileFirst ? 'min' : 'max'}-width: ${screenWidth}px)`,
      src: ctx.$img!(input, { ...opts.modifiers, width: _cWidth, height: _cHeight }, opts)
    })
  }

  variants.sort((v1, v2) => {
    if (mobileFirst) {
      return v2.screenWidth - v1.screenWidth
    } else {
      return v1.screenWidth - v2.screenWidth
    }
  })

  const defaultVar = variants[variants.length - 1]
  if (defaultVar) {
    defaultVar.media = ''
  }

  return {
    sizes: variants.map(v => `${v.media ? v.media + ' ' : ''}${v.size}`).join(', '),
    srcset: variants.map(v => `${v.src} ${v.width}w`).join(', '),
    src: defaultVar?.src
  }
}
