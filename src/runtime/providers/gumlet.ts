import { joinURL } from 'ufo'
import type { ProviderGetImage } from 'src'
import { createOperationsGenerator } from '~image'

export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    format: 'format',
    quality: 'q',
    backgroundColor: 'bg',
    rotate: 'rot',
    mask: 'mask',
    auto: 'auto',
    crop: 'crop',
    brightness: 'bri',
    contrast: 'con',
    exposure: 'exp',
    gamma: 'gam',
    highlight: 'high',
    hueShift: 'hue',
    invert: 'invert',
    saturation: 'sat',
    sharpen: 'sharp',
    padding: 'pad',
    paletteColorCount: 'colors',
    colorPaletteExtraction: 'palette',
    cssPrefix: 'prefix',
    jsonFaceData: 'faces',
    fillMode: 'fill',
    fillColor: 'fill-color',
    transparency: 'transparency',
    focalPointDebug: 'fp-debug',
    focalPointXPosition: 'fp-x',
    focalPointYPosition: 'fp-y',
    focalPointZoom: 'fp-z',
    chromaSubsampling: 'chromasub',
    colorQuantization: 'colorquant',
    colorSpace: 'cs',
    download: 'dl',
    dotsPerInch: 'dpi',
    losslessCompression: 'lossless',
    maskBackgroundColor: 'mask-bg',
    maskCornerRadius: 'corner-radius',
    pdfPageNumber: 'page',
    pixelDensity: 'dpr',
    orientation: 'orient',
    flipAxis: 'flip',
    aspectRatio: 'ar',
    maximumHeight: 'max-h',
    maximumWidth: 'max-w',
    minimumHeight: 'min-h',
    minimumWidth: 'min-w',
    sourceRectangleRegion: 'rect',
    monochrome: 'monochrome',
    pixellate: 'px',
    sepiaTone: 'sepia'
  },
  valueMap: {
    fit: {
      fill: 'scale',
      inside: 'max',
      outside: 'min',
      cover: 'crop',
      contain: 'fill',
      clamp: 'clamp',
      clip: 'clip',
      facearea: 'facearea',
      fillMax: 'fillmax'
    },
    format: {
      gif: 'gif',
      jpg: 'jpg',
      json: 'json',
      png: 'png',
      avif: 'avif',
      webp: 'webp',
      auto: 'auto'
    }
  },
  joinWith: '&',
  formatter: (key, value) => `${key}=${value}`
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? ('?' + operations) : ''))
  }
}
