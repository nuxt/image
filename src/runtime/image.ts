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

export function createImage({  providers, defaultProvider, presets }: CreateImageOptions) {
  const presetMap = presets.reduce((map, preset) => {
    map[preset.name] = preset
    return map
  }, {})
  function image(src: string, modifiers: ImageModifiers, options: any = {}) {
    if (src.includes(':')) {
      const [srcConfig, ...rest] = src.split(':')
      src = rest.join(':')
      const [provider, preset] = srcConfig.split('+')

      options.provider = provider || options.provider
      options.preset = preset || options.preset
    }

    if (!src || src[0] !== '/') {
      throw new Error('Unsupported image src "' + src + '", src path must be absolute. like: `/awesome.png`')
    }
    
    const p = providers[options.provider || defaultProvider]
    if (!p) {
      throw new Error('Unsupported provided ' + options.provider)
    }

    if (options.preset && !presetMap[options.preset]) {
      throw new Error('Unsupported preset ' + options.preset)
    }

    const { provider, defaults } = p
    return provider.generateURL(
      src,
      presetMap[options.preset] ? presetMap[options.preset].modifiers : modifiers,
      { ...defaults, ...options }
    )
  }

  presets.forEach(preset => {
    image[preset.name] = (src) => {
      return image(src, preset.modifiers, {
        provider: preset.provider
      })
    }
  })

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

async function readAsDataURI(url: string, host: string, encrypted: boolean) {
  const _url = url.startsWith('http') ? url : `http${encrypted ? 's' : ''}://${host}$ url}`
  const http = _url.startsWith('https') ? await import('https') : await import('http')  
  return await new Promise(async (resolve) => {
      http.get(_url, (resp) => {
          resp.setEncoding('base64');
          let body = "data:" + resp.headers["content-type"] + ";base64,";
          resp.on('data', (data) => { body += data });
          resp.on('end', () => resolve(body));
      }).on('error', (e) => resolve(url))
  })
}