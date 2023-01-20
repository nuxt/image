import { joinURL } from "ufo";
import { createOperationsGenerator } from "~image";
export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: "w",
    height: "h",
    quality: "cmpr",
    format: "f",
    fit: "m",
    passThrough: "pass",
    sharpen: "s",
    rotate: "r",
    screenPercent: "pc",
    crop: "cr",
    inline: "in",
    metadata: "meta"
  },
  valueMap: {
    fit: {
      cover: "cropbox",
      contain: "letterbox",
      fill: "stretch",
      inside: "box",
      outside: "box"
    },
    format: {
      jpeg: "jpg"
    },
    quality(value) {
      let compression = 100 - parseInt(value, 10);
      if (compression === 100) {
        compression = 99;
      }
      return compression.toString();
    }
  },
  joinWith: "/",
  formatter: (key, value) => `${key}_${value}`
});
export const getImage = (src, { modifiers = {}, baseURL = "/" } = {}) => {
  const operations = operationsGenerator(modifiers);
  return {
    url: joinURL(baseURL, src + (operations ? "?imgeng=/" + operations : ""))
  };
};
