import { joinURL } from "ufo";
import { createMapper, createOperationsGenerator } from "~image";
const fits = createMapper({
  fill: "resize",
  inside: "contain",
  outside: "contain",
  cover: "cover",
  contain: "inside",
  missingValue: "cover"
});
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: "output",
    quality: "quality",
    background: "background",
    focus: "focus",
    zoom: "zoom"
  },
  valueMap: {
    format(value) {
      if (value === "jpg") {
        return "jpeg";
      }
      return value;
    },
    background(value) {
      if (value.startsWith("#")) {
        return value.replace("#", "");
      }
      return value;
    },
    focus: {
      auto: "auto",
      faces: "faces",
      north: "50px0p",
      northEast: "100px0p",
      northWest: "0px0p",
      west: "0px50p",
      southWest: "100px100p",
      south: "50px100p",
      southEast: "0px100p",
      east: "100px50p",
      center: "50px50p"
    }
  },
  joinWith: "/",
  formatter: (key, value) => `${key}=${value}`
});
export const getImage = (src, { modifiers = {}, baseURL = "/" } = {}) => {
  const { width, height, fit, ...providerModifiers } = modifiers;
  let w = width;
  let h = height;
  if (width || height) {
    if (fit && fit === "outside") {
      w = Math.max(width || 0, height || 0);
      h = Math.max(width || 0, height || 0);
    }
    providerModifiers[fits(fit)] = `${w || "-"}x${h || "-"}`;
  }
  const operations = operationsGenerator(providerModifiers);
  return {
    url: joinURL(baseURL, src + (operations ? "?twic=v1/" + operations : ""))
  };
};
