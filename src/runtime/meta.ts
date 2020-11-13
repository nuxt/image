import { RuntimeImageInfo } from 'types'

async function _getMeta (url): Promise<RuntimeImageInfo> {
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

    return meta
  }
}

export async function getMeta (url, cache): Promise<RuntimeImageInfo> {
  const cacheKey = 'image:meta:' + url
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  const meta = await _getMeta(url).catch((err) => {
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
