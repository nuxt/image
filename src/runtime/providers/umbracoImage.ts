import { createOperationsGenerator, type InferModifiers } from '../utils/index'
import { defineProvider } from '../utils/provider'
import { joinURL } from 'ufo'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'width',
    height: 'height',
    focalPointXY: 'rxy',
    format: 'format',
    quality: 'quality',
    fit: 'rmode',
    sampler: 'rsampler',
    anchorPosition: 'ranchor'
  },
  joinWith: '&',
})
const defaultModifiers = {
  format: 'webp',
  quality: '50',
}

interface ImageSharpOptions {
  baseUrl?: string
  modifiers?: InferModifiers<typeof operationsGenerator>
    & { fit?: 'boxpad' | 'crop' | 'manual' | 'max' | 'min' | 'pad' | 'stretch' }
    & { sampler?: 'bicubic' | 'nearest' | 'box' | 'mitchell' | 'catmull' | 'lanczos2' | 'lanczos3' | 'lanczos5' | 'lanczos8' | 'welch' | 'robidoux' | 'robidouxsharp' | 'spline' | 'triangle' | 'hermite' }
    & { anchorPosition?: 'bottom' | 'bottomleft' | 'bottomright' | 'center' | 'left' | 'right' | 'top' | 'topleft' | 'topright' }
}

export default defineProvider<ImageSharpOptions>({
  getImage: (src, {
    modifiers,
    baseUrl = '',
  }) => {
    const mergedModifiers = { ...defaultModifiers, ...modifiers }
    const operations = operationsGenerator(mergedModifiers)

    return {
      url: joinURL(baseUrl, src + (operations ? ('?' + operations) : '')),
    }
  },
})
