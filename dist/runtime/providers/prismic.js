import { joinURL, parseQuery, parseURL, stringifyQuery } from "ufo";
import { operationsGenerator } from "./imgix";
const PRISMIC_IMGIX_BUCKET = "https://images.prismic.io";
export const getImage = (src, { modifiers = {}, baseURL = PRISMIC_IMGIX_BUCKET } = {}) => {
  const operations = operationsGenerator(modifiers);
  const parsedURL = parseURL(src);
  return {
    url: joinURL(baseURL, parsedURL.pathname + "?" + stringifyQuery(Object.assign(parseQuery(parsedURL.search), parseQuery(operations))))
  };
};
