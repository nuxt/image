import { joinURL } from "ufo";
import { createOperationsGenerator } from "~image";
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: "func",
    quality: "q",
    format: "force_format"
  },
  valueMap: {
    fit: {
      cover: "crop",
      contain: "fit",
      fill: "cover",
      inside: "bound",
      outside: "boundmin"
    }
  },
  joinWith: "&",
  formatter: (key, value) => `${key}=${value}`
});
export const getImage = (src, {
  modifiers = {},
  baseURL = "",
  token = "demo",
  cdnURL = ""
} = {}) => {
  const operations = operationsGenerator(modifiers);
  if (!cdnURL) {
    cdnURL = `https://${token}.cloudimg.io/v7`;
  }
  return {
    url: joinURL(cdnURL, baseURL, src) + (operations ? "?" + operations : "")
  };
};
