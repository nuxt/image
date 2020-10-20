import type { CreateImageOptions, ImageModifiers, ImagePreset } from 'types'

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

    if (!src.match(/^(https?:\/\/|\/.*)/)) {
      throw new Error('Unsupported image src "' + src + '", src path must be absolute. like: `/awesome.png`')
    }

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

  image.getPlaceholder = async (source: string, modifiers: ImageModifiers, options: any = {}) => {
    const { src, provider: sourceProvider } = processSource(source)
    const provider = getProvider(sourceProvider || options.provider || defaultProvider)

    let placeholder
    if (typeof provider.provider.getPlaceholder === 'function') {
      placeholder = provider.provider.getPlaceholder(src, modifiers, {
        ...provider.defaults, ...options
      })
    } else {
      const image = provider.provider.getImage(src, {
        ...modifiers,
        width: 30
      }, provider.defaults)

      placeholder = { url: image.url }

      if (typeof image.getInfo === 'function') {
        const info = await image.getInfo()
        Object.assign(placeholder, info)
      }
    }
    return placeholder
  }

  image.$observer = createObserver()

  return image
}

function createObserver () {
  const observer = (typeof window !== 'undefined' ? new IntersectionObserver(callback) : {}) as IntersectionObserver
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
