import { RuntimeImageInfo } from 'types'

export async function getMeta (url, cache): RuntimeImageInfo {
  const cacheKey = 'image:meta:' + url
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  if (process.client) {
    if (typeof Image === 'undefined') {
      throw new TypeError('Image not supported')
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const meta = {
          width: img.width,
          height: img.height,
          placeholder: url
        }
        cache.set(cacheKey, meta)
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
      height,
      placeholder: `data:${mimeType};base64,${data.toString('base64')}`
    }
    cache.set(cacheKey, meta)
    return meta
  }
}
