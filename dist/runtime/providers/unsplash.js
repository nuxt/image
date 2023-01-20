import { joinURL, withBase } from "ufo";
import { operationsGenerator } from "./imgix";
const unsplashCDN = "https://images.unsplash.com/";
export const getImage = (src, { modifiers = {}, baseURL = unsplashCDN } = {}) => {
  const operations = operationsGenerator(modifiers);
  return {
    url: withBase(joinURL(src + (operations ? "?" + operations : "")), baseURL)
  };
};
