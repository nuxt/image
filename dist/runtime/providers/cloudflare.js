import { joinURL, encodeQueryItem } from "ufo";
import { createOperationsGenerator } from "~image";
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: "w",
    height: "h",
    dpr: "dpr",
    fit: "fit",
    gravity: "g",
    quality: "q",
    format: "f",
    sharpen: "sharpen"
  },
  valueMap: {
    fit: {
      cover: "cover",
      contain: "contain",
      fill: "scale-down",
      outside: "crop",
      inside: "pad"
    },
    gravity: {
      auto: "auto",
      side: "side"
    }
  },
  joinWith: ",",
  formatter: (key, val) => encodeQueryItem(key, val)
});
const defaultModifiers = {};
export const getImage = (src, {
  modifiers = {},
  baseURL = "/"
} = {}) => {
  const mergeModifiers = { ...defaultModifiers, ...modifiers };
  const operations = operationsGenerator(mergeModifiers);
  const url = operations ? joinURL(baseURL, "cdn-cgi/image", operations, src) : joinURL(baseURL, src);
  return {
    url
  };
};
