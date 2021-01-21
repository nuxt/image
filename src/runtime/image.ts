import { allowList } from 'allowlist'
import { hasProtocol, joinURL } from 'ufo'
import type { ImageOptions, CreateImageOptions, ResolvedImage, MapToStatic, ImageCTX } from '../types/image'
import { imageMeta } from './utils/meta'
import { parseSize } from './utils'

export function createImage (globalOptions: CreateImageOptions, nuxtContext) {
  const ctx: ImageCTX = {
    options: globalOptions,
    allow: allowList(globalOptions.allow),
    nuxtContext
  }

  function $img (input: string, options: ImageOptions = {}) {
    const image = resolveImage(ctx, input, options)
    if (image.isStatic) {
      handleStaticImage(image, input)
    }
    return image
  }

  function handleStaticImage (image: ResolvedImage, input: string) {
    if (process.static) {
      const staticImagesBase = '/_nuxt/image' // TODO

      if (process.client && 'fetchPayload' in window.$nuxt) {
        const mappedURL = (window.$nuxt as any)?._pagePayload?.pagePayload?.data?.[0]?._img[image.url]
        image.url = mappedURL || input
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

  $img.options = globalOptions
  ctx.$img = $img

  for (const presetName in globalOptions.presets) {
    $img[presetName] = (source: string, _options: ImageOptions = {}) => $img(source, {
      ...globalOptions.presets[presetName],
      ..._options
    })
  }

  $img.getMeta = (input: string, options: ImageOptions) => getMeta(ctx, input, options)

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

  if (input.startsWith('data:') || (hasProtocol(input) && !ctx.allow(input))) {
    return {
      url: input
    }
  }

  const { provider, defaults } = getProvider(ctx, options.provider || ctx.options.provider)
  const preset = getPreset(ctx, options.preset)

  const _options = { ...defaults, ...preset, ...options }
  if (_options.modifiers?.width) {
    _options.modifiers.width = parseSize(_options.modifiers.width)
  }
  if (_options.modifiers?.height) {
    _options.modifiers.height = parseSize(_options.modifiers.height)
  }

  const image = provider.getImage(input, _options, ctx)

  if (_options.modifiers?.format && !image.format) {
    image.format = _options.modifiers.format
  }

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
