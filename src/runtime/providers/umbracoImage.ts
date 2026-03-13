import { createOperationsGenerator, type InferModifiers } from '../utils/index'
import { defineProvider } from '../utils/provider'
import { encodeQueryItem, joinURL } from 'ufo'
import { defu } from 'defu'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'width',
    height: 'height',
    focalPointXY: 'rxy',
    format: 'format',
    quality: 'quality',
    fit: 'rmode',
    sampler: 'rsampler',
    anchorPosition: 'ranchor',
  },
  joinWith: '&',
  formatter: (key, value) => encodeQueryItem(key, value),
})
const defaultModifiers = {
  format: 'webp',
  quality: '50',
}

interface ImageSharpOptions {
  baseURL?: string
  modifiers?: InferModifiers<typeof operationsGenerator>
    & { fit?: 'boxpad' | 'crop' | 'manual' | 'max' | 'min' | 'pad' | 'stretch' }
    & { sampler?: 'bicubic' | 'nearest' | 'box' | 'mitchell' | 'catmull' | 'lanczos2' | 'lanczos3' | 'lanczos5' | 'lanczos8' | 'welch' | 'robidoux' | 'robidouxsharp' | 'spline' | 'triangle' | 'hermite' }
    & { anchorPosition?: 'bottom' | 'bottomleft' | 'bottomright' | 'center' | 'left' | 'right' | 'top' | 'topleft' | 'topright' }
}

export default defineProvider<ImageSharpOptions>({
  getImage: (src, {
    modifiers,
    baseURL = '',
  }) => {
    // modifiers with default values are explicitly deleted, because empty values could override defaults
    if (!modifiers.format) {
      delete modifiers.format
    }
    if (!modifiers.quality) {
      delete modifiers.quality
    }
    const mergedModifiers = defu(modifiers, defaultModifiers)
    const operations = operationsGenerator(mergedModifiers)

    return {
      url: joinURL(baseURL, src + (operations ? ('?' + operations) : '')),
    }
  },
})
