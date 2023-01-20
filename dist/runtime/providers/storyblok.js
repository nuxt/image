import { withBase, joinURL, parseURL } from "ufo";
const storyblockCDN = "https://a.storyblok.com";
export const getImage = (src, { modifiers = {}, baseURL = storyblockCDN } = {}) => {
  const {
    fit,
    smart,
    width = "0",
    height = "0",
    filters = {},
    format,
    quality
  } = modifiers;
  const doResize = width !== "0" || height !== "0";
  if (format) {
    filters.format = format + "";
  }
  if (quality) {
    filters.quality = quality + "";
  }
  const _filters = Object.entries(filters || {}).map((e) => `${e[0]}(${e[1]})`).join(":");
  const options = joinURL(fit ? `fit-${fit}` : "", doResize ? `${width}x${height}` : "", smart ? "smart" : "", _filters ? "filters:" + _filters : "");
  const { pathname } = parseURL(src);
  const modifier = options ? "/m/" : "";
  const url = withBase(joinURL(pathname, modifier, options), baseURL);
  return {
    url
  };
};
