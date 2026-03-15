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
const defaultModifiers = {}

interface UmbracoImageOptions {
  baseURL?: string
  modifiers?: InferModifiers<typeof operationsGenerator>
    & { fit?: 'boxpad' | 'crop' | 'manual' | 'max' | 'min' | 'pad' | 'stretch' | 'contain' }
    & { sampler?: 'bicubic' | 'nearest' | 'box' | 'mitchell' | 'catmull' | 'lanczos2' | 'lanczos3' | 'lanczos5' | 'lanczos8' | 'welch' | 'robidoux' | 'robidouxsharp' | 'spline' | 'triangle' | 'hermite' }
    & { anchorPosition?: 'bottom' | 'bottomleft' | 'bottomright' | 'center' | 'left' | 'right' | 'top' | 'topleft' | 'topright' }
}

export default defineProvider<UmbracoImageOptions>({
  getImage: (src, {
    modifiers,
    baseURL = '',
  }) => {
    // modifier.fit - 'contain' is remapped to use 'crop', since this is the value used by ImageSharp.
    if (modifiers.fit === 'contain') {
      modifiers.fit = 'crop'
    }

    const mergedModifiers = defu(modifiers, defaultModifiers)
    const operations = operationsGenerator(mergedModifiers)

    return {
      url: joinURL(baseURL, src + (operations ? ('?' + operations) : '')),
    }
  },
})
