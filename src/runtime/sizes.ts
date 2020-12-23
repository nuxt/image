import type { ImageSize, ImageOptions } from '../types'
import { getFileExtension } from './utils'
import type { ImageCTX } from './image'

export type InputSizes = Partial<ImageSize>[] | string | boolean

export function getSizes (ctx: ImageCTX, input: string, sizes: InputSizes, options: ImageOptions) {
  if (options?.modifiers?.format === 'svg' || getFileExtension(input) === 'svg') {
    return [{
      url: input
    }]
  }

  if (typeof sizes === 'string') {
    sizes = sizes
      .split(',')
      .map(set => set.match(/((\d+):)?(\d+)\s*(\((\w+)\))?/))
      .filter(match => !!match)
      .map((match, index, array): Partial<ImageSize> => ({
        width: parseInt(match[3], 10),
        breakpoint: parseInt(match[2] || (index !== array.length - 1 && match[3]), 10)
      }))
  }

  if (!Array.isArray(sizes)) {
    if (sizes === true) {
      sizes = options.responsiveSizes.map(width => ({ width, breakpoint: width }))
    } else {
      sizes = [{}]
    }
  }

  sizes = (sizes as Partial<ImageSize>[]).map((size) => {
    if (!size.media) {
      size.media = size.breakpoint ? `(max-width: ${size.breakpoint}px)` : ''
    }

    const { url } = ctx.$img(input, {
      ...options,
      modifiers: {
        ...options.modifiers,
        width: size?.width,
        format: size?.format
      }
    })

    size.url = url
    return size
  })

  return sizes
}
