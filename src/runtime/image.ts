import { RuntimeProvider, ImageModifiers } from '../types'

interface CreateImageOptions {
  providers: {
    [name: string]: {
      defaults: any
      provider: RuntimeProvider
    }
  }
  defaultProvider: string
}

export function createImage({  providers, defaultProvider }: CreateImageOptions) {
  function image(src: string, modifiers: ImageModifiers, options: any = {}) {
    if (src.includes(':')) {
      const [srcProvider, ...rest] = src.split(':')
      src = rest.join(':')
      options.provider = srcProvider
    }
    
    const p = providers[options.provider || defaultProvider]
    if (!p) {
      throw new Error('Unsupported provided ' + options.provider)
    }
    const { provider, defaults } = p
    return provider.generateURL(src, modifiers, { ...defaults, ...options })
  }

  // TODO: generalize for presets
  image.lqip = (src) => {
    return image(src, { contain: '20x20' })
  }
  image.$observer = createObserver()

  return image
}


function createObserver() {
  // @ts-ignore
  const observer = (process.client ? new IntersectionObserver(callback) : {}) as IntersectionObserver
  const elementCallbackMap = {}
  function callback(entries, imgObserver) {
      entries.forEach((entry) => {
          if (entry.isIntersecting) {
              const lazyImage = entry.target
              const callback = elementCallbackMap[lazyImage.__unique]
              if (typeof callback === "function") {
                  callback()
              }
              delete elementCallbackMap[lazyImage.__unique]
              imgObserver.unobserve(lazyImage)
          }
      })
  }
  return {
      add(target, component, unique) {
          // add unique id to recognize target
          target.__unique = unique || target.id || target.__vue__._uid 
          elementCallbackMap[target.__unique] = component;
          observer.observe(target)
      },
      remove(target) {
          delete elementCallbackMap[target.__unique]
          observer.unobserve(target)
      }
  }
}