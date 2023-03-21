import type { ProviderGetImage } from "../../types";
import { constructCloudinaryUrl } from "@cloudinary-util/url-loader";

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL = "/" } = {}
) => {
  return {
    url: constructCloudinaryUrl({
      options: {
        src: src.includes("//") ? src.substring(1) : src,
        ...modifiers,
      },
      config: {
        cloud: {
          cloudName: baseURL
            .replace("https://res.cloudinary.com/", "")
            .split("/")[0],
        },
      },
    }),
  };
};
