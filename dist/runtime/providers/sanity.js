import { joinURL } from "ufo";
import { createOperationsGenerator } from "~image";
const sanityCDN = "https://cdn.sanity.io/images";
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: "fm",
    height: "h",
    quality: "q",
    width: "w",
    background: "bg",
    download: "dl",
    sharpen: "sharp",
    orientation: "or",
    "min-height": "min-h",
    "max-height": "max-h",
    "min-width": "min-w",
    "max-width": "max-w",
    minHeight: "min-h",
    maxHeight: "max-h",
    minWidth: "min-w",
    maxWidth: "max-w",
    saturation: "sat"
  },
  valueMap: {
    format: {
      jpeg: "jpg"
    },
    fit: {
      cover: "crop",
      contain: "fill",
      fill: "scale",
      inside: "min",
      outside: "max"
    }
  },
  joinWith: "&",
  formatter: (key, value) => String(value) === "true" ? key : `${key}=${value}`
});
const isDev = process.env.NODE_ENV === "development";
const getMetadata = (id) => {
  const result = id.match(/-(?<width>\d*)x(?<height>\d*)-(?<format>.*)$/);
  if (!result || !result.groups) {
    if (isDev) {
      console.warn(`An invalid image asset ID was passed in: ${id}`);
    }
    return { width: void 0, height: void 0, format: void 0 };
  }
  const width = Number(result.groups.width);
  const height = Number(result.groups.height);
  return {
    width,
    height,
    format: result.groups.format
  };
};
export const getImage = (src, { modifiers = {}, projectId, dataset = "production" } = {}) => {
  const { height: sourceHeight, width: sourceWidth } = getMetadata(src);
  if (modifiers.crop && typeof modifiers.crop !== "string" && sourceWidth && sourceHeight) {
    const left = modifiers.crop.left * sourceWidth;
    const top = modifiers.crop.top * sourceHeight;
    const right = sourceWidth - modifiers.crop.right * sourceWidth;
    const bottom = sourceHeight - modifiers.crop.bottom * sourceHeight;
    modifiers.rect = [left, top, right - left, bottom - top].map((i) => i.toFixed(0)).join(",");
    delete modifiers.crop;
  }
  if (modifiers.hotspot && typeof modifiers.hotspot !== "string") {
    modifiers["fp-x"] = modifiers.hotspot.x;
    modifiers["fp-y"] = modifiers.hotspot.y;
    delete modifiers.hotspot;
  }
  if (!modifiers.format || modifiers.format === "auto") {
    if (modifiers.format === "auto") {
      delete modifiers.format;
    }
    modifiers.auto = "format";
  }
  if (modifiers.fit === "contain" && !modifiers.bg) {
    modifiers.bg = "ffffff";
  }
  const operations = operationsGenerator(modifiers);
  const parts = src.split("-").slice(1);
  const format = parts.pop();
  const filenameAndQueries = parts.join("-") + "." + format + (operations ? "?" + operations : "");
  return {
    url: joinURL(sanityCDN, projectId, dataset, filenameAndQueries)
  };
};
