import { getImage as _getImage } from './ipx'

export const getImage: typeof _getImage = (src, options, ctx) => ({
  ..._getImage(src, options, ctx),
  isStatic: true
})
