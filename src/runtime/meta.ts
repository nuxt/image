// export type ImageMeta {
//   width: number;
//   height: number;
//   data: any;
// }

export async function getMeta (url) {
  if (process.client) {
    if (typeof Image === 'undefined') {
      throw new TypeError('Image not supported')
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          placeholder: url
        })
      }
      img.onerror = err => reject(err)
      img.src = url
    })
  }

  if (process.server) {
    const imageMeta = await import('image-meta')
    const data: Buffer = await fetch(url).then((res: any) => res.buffer())
    const { width, height, mimeType } = await imageMeta(data)
    return {
      width,
      height,
      placeholder: `data:${mimeType};base64,${data.toString('base64')}`
    }
  }
}
