import { joinURL } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'
import { createOperationsGenerator } from '#image'

export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'width',
    height: 'height',
    aspectRatio: 'aspect_ratio',
    quality: 'quality',
    sharpen: 'sharpen',
    blur: 'blur',
    crop: 'crop',
    cropGravity: 'crop_gravity',
    flip: 'flip',
    flop: 'flop',
    brightness: 'brightness',
    saturation: 'saturation',
    hue: 'hue',
    contrast: 'contrast',
    autoOptimize: 'auto_optimize',
    sepia: 'sepia',
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`,
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL } = {}) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? '?' + operations : '')),
  }
}
