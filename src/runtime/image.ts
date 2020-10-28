import type { CreateImageOptions, ImageModifiers, ImagePreset } from 'types'
import { getMeta } from './meta'

function processSource (src: string) {
  if (!src.includes(':') || src.match('^https?://')) {
    return { src }
  }

  const [srcConfig, ...rest] = src.split(':')
  const [provider, preset] = srcConfig.split('+')

  return {
    src: rest.join(':'),
    provider,
    preset
  }
}

export function createImage (context, { providers, defaultProvider, presets, intersectOptions }: CreateImageOptions) {
  const presetMap = presets.reduce((map, preset) => {
    map[preset.name] = preset
    return map
  }, {})

  function getProvider (name: string) {
    const provider = providers[name]
    if (!provider) {
      throw new Error('Unsupported provider ' + name)
    }
    return provider
  }

  function getPreset (name: string): ImagePreset | false {
    if (!name) {
      return false
    }
    if (!presetMap[name]) {
      throw new Error('Unsupported preset ' + name)
    }
    return presetMap[name]
  }

  function image (source: string, modifiers: ImageModifiers, options: any = {}) {
    const { src, provider: sourceProvider, preset: sourcePreset } = processSource(source)
    const provider = getProvider(sourceProvider || options.provider || defaultProvider)
    const preset = getPreset(sourcePreset || options.preset)

    const image = provider.provider.getImage(
      src,
      preset ? preset.modifiers : modifiers,
      { ...provider.defaults, ...options }
    )
    const { url: providerUrl, isStatic } = image

    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.$nuxt._pagePayload !== 'undefined') {
      // @ts-ignore
      const jsonPData = window.$nuxt._pagePayload.data[0]
      if (jsonPData.images[providerUrl]) {
        // Hydration with hash
        return jsonPData.images[providerUrl]
      }
      // return original source on cache fail in full static mode
      return src
    }

    const nuxtState = context.nuxtState || context.ssrContext.nuxt
    if (!nuxtState.data || !nuxtState.data.length) {
      nuxtState.data = [{}]
    }
    const data = nuxtState.data[0]
    data.images = data.images || {}

    let url = providerUrl
    if (data.images[url]) {
      // Hydration with hash
      url = data.images[url]
    } else if (context.ssrContext && typeof context.ssrContext.mapImage === 'function') {
      // Full Static
      const originalURL = url
      url = context.ssrContext.mapImage({ url, isStatic, format: modifiers.format, src })

      if (url) {
        data.images[providerUrl] = url
      } else {
        url = originalURL
      }
    }

    return url
  }

  presets.forEach((preset) => {
    image[preset.name] = (src) => {
      return image(src, preset.modifiers, {
        provider: preset.provider
      })
    }
  })
  image.getMeta = async (source: string, modifiers: ImageModifiers, options: any = {}) => {
    const { src, provider: sourceProvider } = processSource(source)
    const provider = getProvider(sourceProvider || options.provider || defaultProvider)

    const sImage = provider.provider.getImage(src, { ...modifiers, width: 30 }, provider.defaults)

    const meta = await { placeholder: sImage.url }

    if (typeof sImage.getMeta === 'function') {
      Object.assign(meta, await sImage.getMeta())
    } else {
      const baseUrl = 'http://localhost:3000'
      const absoluteUrl = sImage.url[0] === '/' ? baseUrl + sImage.url : sImage.url
      Object.assign(meta, await getMeta(absoluteUrl))
    }

    return meta
  }

  image.$observer = createObserver(intersectOptions)

  return image
}

function createObserver (options: object) {
  const intersectOptions = {
    rootMargin: '50px',
    ...options
  }
  const observer = (typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(callback, intersectOptions) : {}) as IntersectionObserver
  const elementCallbackMap = {}
  function callback (entries, imgObserver) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target
        const callback = elementCallbackMap[lazyImage.__unique]
        if (typeof callback === 'function') {
          callback()
        }
        delete elementCallbackMap[lazyImage.__unique]
        imgObserver.unobserve(lazyImage)
      }
    })
  }
  return {
    add (target, component, unique) {
      // add unique id to recognize target
      target.__unique = unique || target.id || target.__vue__._uid
      elementCallbackMap[target.__unique] = component
      observer.observe(target)
    },
    remove (target) {
      delete elementCallbackMap[target.__unique]
      observer.unobserve(target)
    }
  }
}
