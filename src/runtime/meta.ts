import type { ImageInfo } from '../types/image'
import type { ImageCTX } from './image'

export async function imageMeta (ctx: ImageCTX, url): Promise<ImageInfo> {
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
      placeholder: ''
    }
  })

  cache.set(cacheKey, meta)
  return meta
}

async function _imageMeta (url): Promise<ImageInfo> {
  if (process.client) {
    if (typeof Image === 'undefined') {
      throw new TypeError('Image not supported')
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const meta = {
          width: img.width,
          height: img.height
          // placeholder: url
        }
        resolve(meta)
      }
      img.onerror = err => reject(err)
      img.src = url
    })
  }

  if (process.server) {
    const imageMeta = require('image-meta').default
    const data: Buffer = await fetch(url).then((res: any) => res.buffer())
    const { width, height, mimeType } = await imageMeta(data)
    const meta = {
      width,
      height
      // placeholder: `data:${mimeType};base64,${data.toString('base64')}`
    }

    return meta
  }
}

function getCache (ctx: ImageCTX) {
  if (!ctx.nuxtContext.cache) {
    if (ctx.nuxtContext.ssrContext && ctx.nuxtContext.ssrContext.cache) {
      ctx.nuxtContext.cache = ctx.nuxtContext.ssrContext.cache
    } else {
      const _cache = {}
      ctx.nuxtContext.cache = {
        get: id => _cache[id],
        set: (id, value) => { _cache[id] = value },
        has: id => typeof _cache[id] !== 'undefined'
      }
    }
  }
  return ctx.nuxtContext.cache
}
