import { joinURL, encodePath } from "ufo";
import defu from "defu";
import { createOperationsGenerator } from "~image";
const convertHextoRGBFormat = (value) => value.startsWith("#") ? value.replace("#", "rgb_") : value;
const removePathExtension = (value) => value.replace(/\.[^/.]+$/, "");
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    fit: "c",
    width: "w",
    height: "h",
    format: "f",
    quality: "q",
    background: "b",
    rotate: "a",
    roundCorner: "r",
    gravity: "g",
    effect: "e",
    color: "co",
    flags: "fl",
    dpr: "dpr",
    opacity: "o",
    overlay: "l",
    underlay: "u",
    transformation: "t",
    zoom: "z",
    colorSpace: "cs",
    customFunc: "fn",
    density: "dpi"
  },
  valueMap: {
    fit: {
      fill: "fill",
      inside: "pad",
      outside: "lpad",
      cover: "fit",
      contain: "scale",
      minCover: "mfit",
      minInside: "mpad",
      thumbnail: "thumb",
      cropping: "crop",
      coverLimit: "limit"
    },
    format: {
      jpeg: "jpg"
    },
    background(value) {
      return convertHextoRGBFormat(value);
    },
    color(value) {
      return convertHextoRGBFormat(value);
    },
    gravity: {
      auto: "auto",
      subject: "auto:subject",
      face: "face",
      sink: "sink",
      faceCenter: "face:center",
      multipleFaces: "faces",
      multipleFacesCenter: "faces:center",
      north: "north",
      northEast: "north_east",
      northWest: "north_west",
      west: "west",
      southWest: "south_west",
      south: "south",
      southEast: "south_east",
      east: "east",
      center: "center"
    }
  },
  joinWith: ",",
  formatter: (key, value) => `${key}_${value}`
});
const defaultModifiers = {
  format: "auto",
  quality: "auto"
};
export const getImage = (src, { modifiers = {}, baseURL = "/" } = {}) => {
  const mergeModifiers = defu(modifiers, defaultModifiers);
  const operations = operationsGenerator(mergeModifiers);
  const remoteFolderMapping = baseURL.match(/\/image\/upload\/(.*)/);
  if (remoteFolderMapping?.length >= 1) {
    const remoteFolder = remoteFolderMapping[1];
    const baseURLWithoutRemoteFolder = baseURL.replace(remoteFolder, "");
    return {
      url: joinURL(baseURLWithoutRemoteFolder, operations, remoteFolder, src)
    };
  } else if (/\/image\/fetch\/?/.test(baseURL)) {
    src = encodePath(src);
  } else {
    src = removePathExtension(src);
  }
  return {
    url: joinURL(baseURL, operations, src)
  };
};
