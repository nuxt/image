import { getImage as _getImage } from "./ipx";
export const getImage = (src, options, ctx) => ({
  ..._getImage(src, options, ctx),
  isStatic: true
});
export const supportsAlias = true;
