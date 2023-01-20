import { joinURL } from "ufo";
import { createOperationsGenerator } from "~image";
export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    height: "h",
    fit: "nf_resize",
    width: "w"
  },
  valueMap: {
    fit: {
      fill: "smartcrop",
      contain: "fit"
    }
  },
  joinWith: "&",
  formatter: (key, value) => `${key}=${value}`
});
const isDev = process.env.NODE_ENV === "development";
export const getImage = (src, { modifiers = {}, baseURL = "/" } = {}) => {
  if (modifiers.format) {
    delete modifiers.format;
  }
  const hasTransformation = modifiers.height || modifiers.width;
  if (!modifiers.fit && hasTransformation) {
    modifiers.fit = "contain";
  }
  if (hasTransformation && modifiers.fit !== "contain" && !(modifiers.height && modifiers.width)) {
    if (isDev) {
      console.warn(`Defaulting to fit=contain as smart cropping is only supported when providing both height and width. Warning originated from \`${src}\`.`);
    }
    modifiers.fit = "contain";
  }
  if (isDev) {
    return { url: src };
  }
  const operations = operationsGenerator(modifiers);
  return {
    url: joinURL(baseURL, src + (operations ? "?" + operations : ""))
  };
};
