import { allowList, Matcher } from 'allowlist'
import type { AllowlistOptions } from 'allowlist'
import { hasProtocol } from 'ufo'
import type { RuntimeProvider, ImageOptions, RuntimeImage } from '../types'
import { isRemoteUrl } from '../utils'
import { createObserver } from '../utils/observer'
import { imageMeta } from './meta'
import { getSizes, InputSizes } from './sizes'

export interface CreateImageOptions {
  providers: {
    [name: string]: {
      defaults: any,
      provider: RuntimeProvider
    }
  }
  presets: { [name: string]: ImageOptions}
  provider: string
  intersectOptions: object
  responsiveSizes: number[]
  allow: AllowlistOptions
}

export interface ImageCTX {
  options: CreateImageOptions,
  allow: Matcher<any>
  nuxtContext: {
    ssrContext: any
    cache?: any
    isDev: boolean
    isStatic: boolean
    nuxtState?: any
  }
  $img?: Function
}

export interface ParsedImage {
  input: string
  image: RuntimeImage
  provider: RuntimeProvider
  preset: ImageOptions
}

export function createImage (globalOptions: CreateImageOptions, nuxtContext) {
  const ctx: ImageCTX = {
    options: globalOptions,
    allow: allowList(globalOptions.allow),
    nuxtContext
  }

  function $img (input: string, options: ImageOptions = {}) {
    const { image } = parseImage(ctx, input, options)

    // Full static
    // @ts-ignore
    if (typeof window !== 'undefined' && window.$nuxt && window.$nuxt._pagePayload) {
      // @ts-ignore
      const jsonPData = window.$nuxt._pagePayload.data[0]
      if (jsonPData.nuxtImageMap[input]) {
        // Hydration with hash
        image.url = jsonPData.nuxtImageMap[input]
      } else if (image.isStatic) {
        image.url = input
      }
      // Return original source on cache fail in full static mode
      return image
    }

    // Client-Side rendering without server
    if (typeof window !== 'undefined' && !ctx.nuxtContext.isDev && ctx.nuxtContext.isStatic && image.isStatic) {
      image.url = input
      return image
    }

    const nuxtState = ctx.nuxtContext.nuxtState || ctx.nuxtContext.ssrContext.nuxt
    if (!nuxtState.data || !nuxtState.data.length) { nuxtState.data = [{}] }
    const data = nuxtState.data[0]
    data.nuxtImageMap = data.nuxtImageMap || {}

    if (data.nuxtImageMap[image.url]) {
      // Hydration with hash
      image.url = data.nuxtImageMap[image.url]
    } else if (typeof ctx.nuxtContext.ssrContext?.mapImage === 'function') {
      // Full Static
      const mappedUrl = ctx.nuxtContext.ssrContext?.mapImage({ input, image, options })
      if (mappedUrl) {
        image.url = mappedUrl
        data.nuxtImageMap[image.url] = mappedUrl
      }
    }

    return image
  }

  ctx.$img = $img

  for (const presetName in globalOptions.presets) {
    $img[presetName] = (source: string, _options: ImageOptions = {}) => $img(source, {
      ...globalOptions.presets[presetName],
      ..._options
    })
  }

  $img.$observer = createObserver(globalOptions.intersectOptions)

  $img.sizes = (input: string, sizes: InputSizes, options: ImageOptions) => getSizes(ctx, input, sizes, options)
  $img.getMeta = (input: string, options: ImageOptions) => getMeta(ctx, input, options)

  return $img
}

async function getMeta (ctx: ImageCTX, input: string, options: ImageOptions) {
  const { image } = parseImage(ctx, input, {
    ...options,
    modifiers: {
      ...options.modifiers,
      width: 30,
      quality: 40
    }
  })

  const meta = { placeholder: image.url }

  if (typeof image.getMeta === 'function') {
    Object.assign(meta, await image.getMeta())
  } else {
    const internalUrl = ctx.nuxtContext.ssrContext ? ctx.nuxtContext.ssrContext.internalUrl : ''
    const absoluteUrl = isRemoteUrl(image.url) ? image.url : internalUrl + image.url
    Object.assign(meta, await imageMeta(ctx, absoluteUrl))
  }

  return meta
}

function parseImage (ctx: ImageCTX, input: string, options: ImageOptions): ParsedImage {
  if (typeof input !== 'string') {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`)
  }

  if (input.startsWith('data:') || (hasProtocol(input) && !ctx.allow(input))) {
    return {
      input,
      provider: null,
      preset: null,
      image: {
        url: input,
        isStatic: false
      }
    }
  }

  const { provider, defaults } = getProvider(ctx, options.provider || ctx.options.provider)
  const preset = getPreset(ctx, options.preset)

  const image = provider.getImage(input, { ...defaults, ...options })

  // TODO: Add base
  // if (!hasProtocol(image.url)) {
  //   image.url = joinURL('/', image.url)
  // }

  return {
    input,
    provider,
    preset,
    image
  }
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
