import { stringifyQuery } from 'ufo'
import type { ProviderGetImage } from '../../types'

export const getImage: ProviderGetImage = (src, { modifiers, baseURL = '/_amplify/image' } = {}, ctx) => {
  const validWidths = Object.values(ctx.options.screens || {}).sort((a, b) => a - b)
  const largestWidth = validWidths[validWidths.length - 1]
  let width = Number(modifiers?.width || 0)

  if (!width) {
    width = largestWidth
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line
      console.warn(`A defined width should be provided to use the \`awsAmplify\` provider. Defaulting to \`${largestWidth}\`. Warning originated from \`${src}\`.`)
    }
  } else if (!validWidths.includes(width)) {
    width = validWidths.find(validWidth => validWidth > width) || largestWidth
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line
      console.warn(`The width being used (\`${modifiers?.width}\`) should be added to \`image.screens\`. Defaulting to \`${width}\`. Warning originated from \`${src}\`.`)
    }
  }

  if (process.env.NODE_ENV === 'development') {
    return { url: src }
  }

  return {
    url: baseURL + '?' + stringifyQuery({
      url: src,
      w: String(width),
      q: String(modifiers?.quality || '100')
    })
  }
}

export const validateDomains = true
