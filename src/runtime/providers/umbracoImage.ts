import { createOperationsGenerator } from '../utils/index'
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
  },
  joinWith: '&',
})
const defaultModifiers = {
  format: 'webp',
  quality: '50',
}

interface ImageSharpOptions {
  baseUrl?: string
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
