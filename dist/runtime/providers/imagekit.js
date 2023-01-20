import { joinURL } from "ufo";
import { createOperationsGenerator } from "~image";
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: "c",
    width: "w",
    height: "h",
    format: "f",
    quality: "q",
    bg: "bg",
    background: "bg",
    crop: "c",
    cropMode: "cm",
    aspectRatio: "ar",
    x: "x",
    y: "y",
    xc: "xc",
    yc: "yc",
    oix: "oix",
    oiy: "oiy",
    oixc: "oixc",
    oiyc: "oiyc",
    focus: "fo",
    radius: "r",
    border: "b",
    rotate: "rt",
    blur: "bl",
    named: "n",
    overlayX: "ox",
    overlayY: "oy",
    overlayFocus: "ofo",
    overlayHeight: "oh",
    overlayWidth: "ow",
    overlayImage: "oi",
    overlayImageTrim: "oit",
    overlayImageAspectRatio: "oiar",
    overlayImageBackground: "oibg",
    overlayImageBorder: "oib",
    overlayImageDPR: "oidpr",
    overlayImageQuality: "oiq",
    overlayImageCropping: "oic",
    overlayImageCropMode: "oicm",
    overlayText: "ot",
    overlayTextFontSize: "ots",
    overlayTextFontFamily: "otf",
    overlayTextColor: "otc",
    overlayTextTransparency: "oa",
    overlayTextTypography: "ott",
    overlayBackground: "obg",
    overlayTextEncoded: "ote",
    overlayTextWidth: "otw",
    overlayTextBackground: "otbg",
    overlayTextPadding: "otp",
    overlayTextInnerAlignment: "otia",
    overlayRadius: "or",
    progressive: "pr",
    lossless: "lo",
    trim: "t",
    metadata: "md",
    colorProfile: "cp",
    defaultImage: "di",
    dpr: "dpr",
    effectSharpen: "e-sharpen",
    effectUSM: "e-usm",
    effectContrast: "e-contrast",
    effectGray: "e-grayscale",
    original: "orig"
  },
  valueMap: {
    fit: {
      cover: "maintain_ratio",
      contain: "pad_resize",
      fill: "force",
      inside: "at_max",
      outside: "at_least",
      extract: "extract",
      pad_extract: "pad_extract"
    },
    background(value) {
      if (value.startsWith("#")) {
        return value.replace("#", "");
      }
      return value;
    },
    crop: {
      maintain_ratio: "maintain_ratio",
      force: "force",
      at_max: "at_max",
      at_least: "at_least"
    },
    cropMode: {
      pad_resize: "pad_resize",
      pad_extract: "pad_extract",
      extract: "extract"
    },
    format: {
      auto: "auto",
      jpg: "jpg",
      jpeg: "jpeg",
      webp: "webp",
      avif: "avif",
      png: "png"
    },
    focus: {
      left: "left",
      right: "right",
      top: "top",
      bottom: "bottom",
      custom: "custom",
      center: "center",
      top_left: "top_left",
      top_right: "top_right",
      bottom_left: "bottom_left",
      bottom_right: "bottom_right",
      auto: "auto",
      face: "face"
    },
    rotate: {
      auto: "auto",
      0: "0",
      90: "90",
      180: "180",
      270: "270",
      360: "360"
    },
    overlayFocus: {
      left: "left",
      right: "right",
      top: "top",
      bottom: "bottom",
      custom: "custom",
      center: "center",
      top_left: "top_left",
      top_right: "top_right",
      bottom_left: "bottom_left",
      bottom_right: "bottom_right",
      auto: "auto",
      face: "face"
    },
    overlayImageCropping: {
      maintain_ratio: "maintain_ratio",
      force: "force",
      at_max: "at_max",
      at_least: "at_least"
    },
    overlayImageCropMode: {
      pad_resize: "pad_resize",
      pad_extract: "pad_extract",
      extract: "extract"
    },
    overlayTextTypography: {
      b: "b",
      i: "i"
    },
    overlayTextInnerAlignment: {
      left: "left",
      right: "right",
      center: "center"
    }
  },
  joinWith: ",",
  formatter: (key, value) => `${key}-${value}`
});
export const getImage = (src, { modifiers = {}, baseURL = "/" } = {}) => {
  let operations = operationsGenerator(modifiers);
  operations = operations.replace("c-pad_resize", "cm-pad_resize");
  operations = operations.replace("c-pad_extract", "cm-pad_extract");
  operations = operations.replace("c-extract", "cm-extract");
  return {
    url: joinURL(baseURL, src + (operations ? `?tr=${operations}` : ""))
  };
};
