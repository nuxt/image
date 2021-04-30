import { ProviderGetImage } from 'src'
import { stringifyQuery } from 'ufo'

// https://vercel.com/docs/more/adding-your-framework#images

export const getImage: ProviderGetImage = (src, { modifiers, baseURL = '/_vercel/image' } = {}, ctx) => {
  if (process.env.NODE_ENV === 'development') {
    if (!modifiers?.width) {
      console.warn(`A defined width must be provided to use the \`vercel\` provider. Warning originated from \`${src}\`.`)
      return { url: '/_vercel/width-required' }
    }
    if (!Object.values(ctx.options.screens || {}).includes(Number(modifiers.width))) {
      console.warn(`The width being used (\`${modifiers.width}\`) should be added to \`image.screens\`. Warning originated from \`${src}\`.`)
      return { url: '/_vercel/invalid-width' }
    }
    return { url: src }
  }
  return {
    url: baseURL + '?' + stringifyQuery({
      url: src,
      w: modifiers?.width ? String(modifiers.width) : undefined,
      q: String(modifiers?.quality || '100')
    })
  }
}
