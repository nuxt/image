import { joinURL } from "ufo";
import { createOperationsGenerator } from "~image";
export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: "w",
    height: "h",
    format: "format",
    quality: "q",
    backgroundColor: "bg",
    rotate: "rot",
    mask: "mask",
    auto: "auto",
    crop: "crop",
    brightness: "bri",
    contrast: "con",
    exposure: "exp",
    gamma: "gam",
    highlight: "high",
    hueShift: "hue",
    invert: "invert",
    saturation: "sat",
    sharpen: "sharp",
    padding: "pad",
    paletteColorCount: "colors",
    colorPaletteExtraction: "palette",
    cssPrefix: "prefix",
    jsonFaceData: "faces",
    fillMode: "fill",
    fillColor: "fill-color",
    transparency: "transparency",
    focalPointDebug: "fp-debug",
    focalPointXPosition: "fp-x",
    focalPointYPosition: "fp-y",
    focalPointZoom: "fp-z",
    chromaSubsampling: "chromasub",
    colorQuantization: "colorquant",
    colorSpace: "colorspace",
    dotsPerInch: "dpi",
    pdfPageNumber: "page",
    pixelDensity: "dpr",
    aspectRatio: "ar",
    sourceRectangleRegion: "rect",
    monochrome: "monochrome"
  },
  valueMap: {
    fit: {
      fill: "scale",
      inside: "max",
      outside: "min",
      cover: "crop",
      contain: "fill",
      clamp: "clamp",
      clip: "clip",
      facearea: "facearea",
      fillMax: "fillmax"
    },
    format: {
      gif: "gif",
      jpg: "jpg",
      json: "json",
      png: "png",
      avif: "avif",
      webp: "webp",
      auto: "auto"
    }
  },
  joinWith: "&",
  formatter: (key, value) => `${key}=${value}`
});
export const getImage = (src, { modifiers = {}, baseURL = "/" } = {}) => {
  const operations = operationsGenerator(modifiers);
  return {
    url: joinURL(baseURL, src + (operations ? "?" + operations : ""))
  };
};
