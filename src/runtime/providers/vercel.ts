import { stringifyQuery } from 'ufo'
import type { ProviderGetImage } from '../../types'

// https://vercel.com/docs/more/adding-your-framework#images

export const getImage: ProviderGetImage = (src, { modifiers, baseURL = '/_vercel/image' } = {}, ctx) => {
  const largestWidth = validWidths[validWidths.length - 1]
  let width = Number(modifiers?.width || 0)

  if (!width) {
    width = largestWidth
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line
      console.warn(`A defined width should be provided to use the \`vercel\` provider. Defaulting to \`${largestWidth}\`. Warning originated from \`${src}\`.`)
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
