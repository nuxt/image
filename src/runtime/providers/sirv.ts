import { joinURL } from 'ufo'
import type { ProviderGetImage } from '../../module'
import { createOperationsGenerator } from '#image'

const deleteHash = (value: string) => value.startsWith('#') ? value.replace('#', '') : value
const generateColorKeys = () => {
  const keysNeedingHashDeletion = [
    'canvasBorderColor',
    'frameColor',
    'frameRimColor',
    'colorizeColor',
    'colortoneColor',
    'textColor',
    'textoutlineColor',
    'textBackgroundColor',
  ]

  return Object.fromEntries(
    keysNeedingHashDeletion.map(key => [key, (value: string) => deleteHash(value)]),
  )
}
export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    quality: 'q',
    fit: 'scale.option',
    webpFallback: 'webp-fallback',
    gifCompression: 'gif.lossy',
    crop: 'crop.type',
    cropAr: 'crop.aspectratio',
    cropPaddingX: 'crop.pad.x',
    cropPaddingY: 'crop.pad.y',
    canvasHeight: 'canvas.height',
    canvasWidth: 'canvas.width',
    canvasAr: 'canvas.aspectratio',
    canvasPosition: 'canvas.position',
    canvasBorderWidth: 'canvas.border.width',
    canvasBorderHeight: 'canvas.border.height',
    canvasBorderColor: 'canvas.border.color',
    canvasBorderOpacity: 'canvas.border.opacity',
    watermarkPosition: 'watermark.position',
    watermarkPositionX: 'watermark.position.x',
    watermarkPositionY: 'watermark.position.y',
    watermarkPositionGravity: 'watermark.position.gravity',
    watermarkWidth: 'watermark.scale.width',
    watermarkHeight: 'watermark.scale.height',
    textBase64: 'text.text64',
    textSize: 'text.size',
    textAlign: 'text.align',
    textPosition: 'text.position',
    textPositionX: 'text.position.x',
    textPositionY: 'text.position.y',
    textPositionGravity: 'text.position.gravity',
    textFontSize: 'text.font.size',
    textFontStyle: 'text.font.style',
    textFontFamily: 'text.font.family',
    textFontWeight: 'text.font.weight',
    textColor: 'text.color',
    textOpacity: 'text.opacity',
    textOutlineWidth: 'text.outline.width',
    textoutlineColor: 'text.outline.color',
    textOutlineOpacity: 'text.outline.opacity',
    textOutlineBlur: 'text.outline.blur',
    textBackgroundColor: 'text.background.color',
    textBackgroundOpacity: 'text.background.opacity',
    colorizeColor: 'colorize.color',
    colorizeOpacity: 'colorize.opacity',
    colortoneColor: 'colortone.color',
    colortoneLevel: 'colortone.level',
    colortoneMode: 'colortone.mode',
    vignette: 'vigette.value',
    vignetteColor: 'vigette.color',
    colorlevelBlack: 'colorlevel.black',
    colorlevelWhite: 'colorlevel.white',
    frameStyle: 'frame.style',
    frameColor: 'frame.color',
    frameWidth: 'frame.width',
    frameRimColor: 'frame.rim.color',
    frameRimWidth: 'frame.rim.width',
    pdfPage: 'page',
  },
  valueMap: {
    fit: {
      contain: 'fit',
      fill: 'ignore',
      outside: 'fill',
      inside: 'fill',
      noUpscaling: 'noup',
    },
    crop: {
      face: 'face',
      poi: 'poi',
      trim: 'trim',
    },
    format: {
      jpeg: 'jpg',
      original: 'original',
    },
    ...generateColorKeys(),
  },
  joinWith: '&',
  formatter: (key: any, value: any) => `${key}=${value}`,
})
export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? ('?' + operations) : '')),
  }
}
