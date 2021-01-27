import { allowList } from 'allowlist'
import defu from 'defu'
import { hasProtocol, joinURL } from 'ufo'
import type { ImageOptions, CreateImageOptions, ResolvedImage, MapToStatic, ImageCTX, $Img } from '../types/image'
import { imageMeta } from './utils/meta'
import { parseSize } from './utils'
import { useStaticImageMap } from './utils/static-map'

export function createImage (globalOptions: CreateImageOptions, nuxtContext) {
  const staticImageManifest = (process.client && process.static) ? useStaticImageMap(nuxtContext) : {}

  const ctx: ImageCTX = {
    options: globalOptions,
    accept: allowList(globalOptions.accept),
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
  $img.getSizes = ((input: string, options?: ImageOptions, sizes?: string[]) => getSizes(ctx, input, options, sizes)) as $Img['getSizes']

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

  if (input.startsWith('data:') || (hasProtocol(input) && !ctx.accept(input))) {
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

function getSizes (ctx: ImageCTX, input: string, opts: ImageOptions = {}, sizes?: string[]) {
  let widths = [].concat(sizes || ctx.options.sizes)
  if (opts.modifiers.width) {
    widths.push(opts.modifiers.width)
    widths = widths.filter(w => w <= opts.modifiers.width)
    widths.push(opts.modifiers.width * 2)
  }
  widths = Array.from(new Set(widths))
    .sort((s1, s2) => s1 - s2) // unique & lowest to highest

  const sources = []
  const ratio = opts.modifiers.height / opts.modifiers.width

  for (const width of widths) {
    const height = ratio ? Math.round(width * ratio) : opts.modifiers.height
    sources.push({
      width,
      height,
      src: ctx.$img(input, {
        ...opts.modifiers,
        width,
        height
      }, opts)
    })
  }

  return sources
}
