import { encodeQueryItem, joinURL } from 'ufo'
import { defineProvider, createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    quality: 'q',
    trim: 'trim',
    extend: 'extend',
    extract: 'extract',
    rotate: 'rotate',
    flip: 'flip',
    flop: 'flop',
    sharpen: 'sharpen',
    median: 'median',
    blur: 'blur',
    gamma: 'gamma',
    negate: 'negate',
    normalize: 'normalize',
    threshold: 'threshold',
    tint: 'tint',
    grayscale: 'grayscale',
  },
  valueMap: {
    format: {
      jpg: 'jpeg',
      jpeg: 'jpeg',
      webp: 'webp',
      avif: 'avif',
      png: 'png',
    },
    fit: {
      cover: 'cover',
      contain: 'contain',
      fill: 'fill',
      inside: 'inside',
      outside: 'outside',
    },
    position: {
      center: 'center',
      top: 'top',
      right: 'right',
      bottom: 'bottom',
      left: 'left',
    },
  },
  joinWith: '&',
})

interface AmplifyOptions {
  baseURL?: string
  modifiers?: {
    quality?: string | number
    // TODO: more modifiers
  }
}

export default defineProvider<AmplifyOptions>({
  validateDomains: true,
  getImage: (src, { modifiers, baseURL = '/_amplify/image' }, ctx) => {
    const validWidths = Object.values(ctx.options.screens || {}).sort((a, b) => a - b)
    const largestWidth = validWidths[validWidths.length - 1] || 0
    let width = Number(modifiers?.width || 0)

    if (!width) {
      width = largestWidth
      if (import.meta.dev) {
        console.warn(`A defined width should be provided to use the \`awsAmplify\` provider. Defaulting to \`${largestWidth}\`. Warning originated from \`${src}\`.`)
      }
    }
    else if (!validWidths.includes(width)) {
      width = validWidths.find(validWidth => validWidth > width) || largestWidth
      if (import.meta.dev) {
        console.warn(`The width being used (\`${modifiers?.width}\`) should be added to \`image.screens\`. Defaulting to \`${width}\`. Warning originated from \`${src}\`.`)
      }
    }

    if (import.meta.dev) {
      return { url: src }
    }

    const operations = operationsGenerator({
      ...modifiers,
      width: String(width),
      quality: String(modifiers?.quality || '100'),
    } as any)

    return {
      url: joinURL(baseURL + `?${encodeQueryItem('url', src)}` + (operations ? `&${operations}` : '')),
    }
  },
})
