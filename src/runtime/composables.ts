import type { $Img } from '../module'
import { createImage } from '#image'
// @ts-ignore
import { imageOptions } from '#build/image-options'

export const useImage = () => {
  const img = createImage(imageOptions)

  return {
    generate: (...params: Parameters<$Img>) => img(...params),
    getImage: img.getImage,
    getMeta: img.getMeta,
    getSizes: img.getSizes,
    options: img.options
  }
}
