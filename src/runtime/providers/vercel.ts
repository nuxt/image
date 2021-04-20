import { ProviderGetImage } from 'src'
import { stringifyQuery } from 'ufo'

// https://vercel.com/docs/more/adding-your-framework#images

export const getImage: ProviderGetImage = (src, { modifiers, baseURL = '/_vercel/image' } = {}) => {
  return {
    url: baseURL + '?' + stringifyQuery({
      url: src,
      w: modifiers?.width ? String(modifiers.width) : undefined,
      q: String(modifiers?.quality || '100')
    })
  }
}
