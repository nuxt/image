import type { ImageInfo, ImageCTX } from '../../types/image'

export async function imageMeta (ctx: ImageCTX, url: string): Promise<ImageInfo> {
  const cache = getCache(ctx)

  const cacheKey = 'image:meta:' + url
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  const meta = await _imageMeta(url).catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to get image meta for ' + url, err + '')
    return {
      width: 0,
      height: 0,
      ratio: 0
    }
  })

  cache.set(cacheKey, meta)
  return meta
}

async function _imageMeta (url: string): Promise<ImageInfo> {
  if (process.server) {
    const imageMeta = require('image-meta').default
    const data: Buffer = await fetch(url).then((res: any) => res.buffer())
    const { width, height } = await imageMeta(data)
    const meta = {
      width,
      height,
      ratio: width / height
    }

    return meta
  }
  if (typeof Image === 'undefined') {
    throw new TypeError('Image not supported')
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const meta = {
        width: img.width,
        height: img.height,
        ratio: img.width / img.height
      }
      resolve(meta)
    }
    img.onerror = err => reject(err)
    img.src = url
  })
}

function getCache (ctx: ImageCTX) {
  if (!ctx.nuxtContext.cache) {
    if (ctx.nuxtContext.ssrContext && ctx.nuxtContext.ssrContext.cache) {
      ctx.nuxtContext.cache = ctx.nuxtContext.ssrContext.cache
    } else {
      const _cache: Record<string, any> = {}
      ctx.nuxtContext.cache = {
        get: (id: string) => _cache[id],
        set: (id: string, value: any) => { _cache[id] = value },
        has: (id: string) => typeof _cache[id] !== 'undefined'
      }
    }
  }
  return ctx.nuxtContext.cache
}
