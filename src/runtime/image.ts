import { RuntimeProvider, ImageModifiers } from '../types'

interface ImagePreset {
  name: string
  modifiers: any
  provider?: string
}

interface CreateImageOptions {
  providers: {
    [name: string]: {
      defaults: any
      provider: RuntimeProvider
    }
  }
  presets: ImagePreset[]
  defaultProvider: string
}

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

export function createImage (context, { providers, defaultProvider, presets }: CreateImageOptions) {
  const presetMap = presets.reduce((map, preset) => {
    map[preset.name] = preset
    return map
  }, {})

  function image (source: string, modifiers: ImageModifiers, options: any = {}) {
    const { src, provider: sourceProvider, preset: sourcePreset } = processSource(source)
    const provider = providers[sourceProvider || options.provider || defaultProvider]
    const preset = sourcePreset || options.preset

    if (!src.match(/^(https?:\/\/|\/.*)/)) {
      throw new Error('Unsupported image src "' + src + '", src path must be absolute. like: `/awesome.png`')
    }

    if (!provider) {
      throw new Error('Unsupported provided ' + options.provider)
    }

    if (preset && !presetMap[preset]) {
      throw new Error('Unsupported preset ' + preset)
    }

    const { url: providerUrl, isStatic } = provider.provider.generateURL(
      src,
      presetMap[preset] ? presetMap[preset].modifiers : modifiers,
      { ...provider.defaults, ...options }
    )

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

  image.$observer = createObserver()

  return image
}

function createObserver () {
  const observer = (process.client ? new IntersectionObserver(callback) : {}) as IntersectionObserver
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
