import { joinURL } from 'ufo'
import { createOperationsGenerator } from '../utils/index'
import { defineProvider } from '../utils/provider'

const operationsGenerator = createOperationsGenerator({
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
})

interface BunnyOptions {
  baseURL: string
  // TODO: more modifiers
}

export default defineProvider<BunnyOptions>({
  getImage: (src, { modifiers, baseURL }) => {
    const operations = operationsGenerator(modifiers)
    return {
      url: joinURL(baseURL, src + (operations ? '?' + operations : '')),
    }
  },
})
