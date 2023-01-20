import { joinURL, encodeQueryItem, encodePath, withBase } from "ufo";
import { createOperationsGenerator } from "~image";
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    orientation: "or",
    flip: "flip",
    crop: "crop",
    width: "w",
    height: "h",
    fit: "fit",
    dpr: "dpr",
    bri: "bri",
    con: "con",
    gam: "gam",
    sharp: "sharp",
    blur: "blur",
    pixel: "pixel",
    filt: "filt",
    mark: "mark",
    markw: "markw",
    markh: "markh",
    markx: "markx",
    marky: "marky",
    markpad: "markpad",
    markpos: "markpos",
    markalpha: "markalpha",
    background: "bg",
    border: "border",
    quality: "q",
    format: "fm"
  },
  valueMap: {
    fit: {
      fill: "fill",
      inside: "max",
      outside: "stretch",
      cover: "crop",
      contain: "contain"
    }
  },
  joinWith: "&",
  formatter: (key, val) => encodeQueryItem(key, val)
});
export const getImage = (src, { modifiers = {}, baseURL = "/" } = {}) => {
  const params = operationsGenerator(modifiers);
  return {
    url: withBase(joinURL(encodePath(src) + (params ? "?" + params : "")), baseURL)
  };
};
