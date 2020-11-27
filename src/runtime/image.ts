import defu from 'defu'
import type { CreateImageOptions, ImagePreset, ImageSize, ImageOptions, ImageModifiers } from 'types'
import { getMeta } from './meta'
import { cleanDoubleSlashes, getFileExtension, isRemoteUrl } from './utils'

function getCache (context) {
  if (!context.cache) {
    if (context.ssrContext && context.ssrContext.cache) {
      context.cache = context.ssrContext.cache
    } else {
      const _cache = {}
      context.cache = {
        get: id => _cache[id],
        set: (id, value) => { _cache[id] = value },
        has: id => typeof _cache[id] !== 'undefined'
      }
    }
  }
  return context.cache
}

export function createImage (context, { providers, defaultProvider, presets, intersectOptions, responsiveSizes, allow }: CreateImageOptions) {
  const presetMap: { [key: string]: ImagePreset} = presets.reduce((map, preset) => {
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

  function parseImage (src: string, options: ImageOptions = {} as any) {
    const { modifiers = {} as ImageModifiers } = options
    const isRemote = isRemoteUrl(src)

    if ((isRemote && !allow.accept(src)) || src.startsWith('data:')) {
      return {
        src,
        provider: null,
        preset: null,
        image: {
          url: src,
          isStatic: false
        }
      }
    }
    const provider = getProvider(options.provider || defaultProvider)
    const preset = getPreset(options.preset)

    const image = provider.provider.getImage(
      src,
      defu(modifiers, (preset && (preset as ImagePreset).modifiers)),
      { ...provider.defaults, ...options }
    )

    // apply router base & remove double slashes
    const base = isRemoteUrl(image.url) ? '' : context.base
    image.url = cleanDoubleSlashes(base + image.url)

    return {
      src,
      provider,
      preset,
      image
    }
  }

  function $img (source: string, options: ImageOptions = {} as any) {
    const { modifiers = {} as ImageModifiers } = options
    const { src, image } = parseImage(source, options)
    const { url: providerUrl, isStatic } = image

    /**
     * Handle full static render
     */
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.$nuxt._pagePayload !== 'undefined') {
      // @ts-ignore
      const jsonPData = window.$nuxt._pagePayload.data[0]
      if (jsonPData.nuxtImageMap[providerUrl]) {
        // Hydration with hash
        image.url = jsonPData.nuxtImageMap[providerUrl]
      } else if (image.isStatic) {
        image.url = src
      }
      // return original source on cache fail in full static mode
      return image
    }

    /**
     * Handle client side rendering without server
     */
    if (!context.isDev && typeof window !== 'undefined' && context.isStatic && image.isStatic) {
      image.url = src
      return image
    }

    const nuxtState = context.nuxtState || context.ssrContext.nuxt
    if (!nuxtState.data || !nuxtState.data.length) {
      nuxtState.data = [{}]
    }
    const data = nuxtState.data[0]
    data.nuxtImageMap = data.nuxtImageMap || {}
    const url = providerUrl
    if (data.nuxtImageMap[url]) {
      // Hydration with hash
      image.url = data.nuxtImageMap[url]
    } else if (context.ssrContext && typeof context.ssrContext.mapImage === 'function') {
      // Full Static
      const mappedUrl = context.ssrContext.mapImage({ url, isStatic, format: modifiers.format, src })
      if (mappedUrl) {
        image.url = data.nuxtImageMap[providerUrl] = mappedUrl
      }
    }
    return image
  }

  presets.forEach((preset: ImagePreset) => {
    $img[preset.name] = (src) => {
      return $img(src, {
        modifiers: preset.modifiers,
        provider: preset.provider
      } as ImageOptions)
    }
  })

  $img.sizes = (src: string, sizes: Array<Partial<ImageSize>> | string | boolean, options: ImageOptions = {} as ImageOptions) => {
    const { modifiers = {} as ImageModifiers } = options
    if (modifiers.format === 'svg' || getFileExtension(src) === 'svg') {
      return [{
        url: src
      }]
    }
    if (typeof sizes === 'string') {
      sizes = sizes
        .split(',')
        .map(set => set.match(/((\d+):)?(\d+)\s*(\((\w+)\))?/))
        .filter(match => !!match)
        .map((match, index, array): Partial<ImageSize> => ({
          width: parseInt(match[3], 10),
          breakpoint: parseInt(match[2] || (index !== array.length - 1 && match[3]), 10)
        }))
    }
    if (!Array.isArray(sizes)) {
      if (sizes === true) {
        sizes = responsiveSizes.map(width => ({
          width,
          breakpoint: width
        }))
      } else {
        sizes = [{}]
      }
    }

    sizes = (sizes as Array<ImageSize>).map((size) => {
      if (!size.media) {
        size.media = size.breakpoint ? `(max-width: ${size.breakpoint}px)` : ''
      }
      const { url } = $img(src, {
        ...options,
        modifiers: {
          ...modifiers,
          width: size.width || null,
          format: size.format || null
        }
      })
      size.url = url
      return size
    })
    return sizes
  }

  $img.getResolution = async (source: string, options: ImageOptions = {} as any) => {
    const { image } = parseImage(source, options)

    const internalUrl = context.ssrContext ? context.ssrContext.internalUrl : ''
    const absoluteUrl = isRemoteUrl(image.url) ? image.url : internalUrl + image.url
    try {
      const resolution = await fetch(`${internalUrl}/_image_resolution?url=${absoluteUrl}`).then(res => res.json())
      return resolution
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to get image meta for ' + source, err + '')
      return {
        width: 1,
        height: 0
      }
    }
  }

  $img.getMeta = async (source: string, options: ImageOptions = {} as ImageOptions) => {
    const { image } = parseImage(source, {
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
      const internalUrl = context.ssrContext ? context.ssrContext.internalUrl : ''
      const absoluteUrl = isRemoteUrl(image.url) ? image.url : internalUrl + image.url
      Object.assign(meta, await getMeta(absoluteUrl, getCache(context)))
    }

    return meta
  }

  $img.$observer = createObserver(intersectOptions)

  return $img
}

function printObserver (onMatch) {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return
  }

  const mediaQueryList = window.matchMedia('print')
  mediaQueryList.addListener((query) => {
    if (query.matches) {
      onMatch()
    }
  })
}

function intersectionObserver (onMatch, options) {
  const observer = (typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(onMatch, {
    rootMargin: '50px',
    ...options
  }) : {}) as IntersectionObserver

  return observer
}

function createObserver (intersectionOptions: object) {
  const callbackType = { intersect: 'onIntersect', print: 'onPrint' }
  const elementCallbackMap = {}
  function intersectionCallback (entries, imgObserver) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target
        const callback = elementCallbackMap[lazyImage.__unique]
        if (typeof callback === 'function') {
          callback(callbackType.intersect)
        }
        delete elementCallbackMap[lazyImage.__unique]
        imgObserver.unobserve(lazyImage)
      }
    })
  }

  printObserver(() => {
    Object.values(elementCallbackMap).forEach((callback: any) => callback(callbackType.print))
  })

  const intersectObserver = intersectionObserver(intersectionCallback, intersectionOptions)

  return {
    add (target, component, unique) {
      // add unique id to recognize target
      target.__unique = unique || target.id || target.__vue__._uid
      elementCallbackMap[target.__unique] = component
      intersectObserver.observe(target)
    },
    remove (target) {
      delete elementCallbackMap[target.__unique]
      intersectObserver.unobserve(target)
    }
  }
}
