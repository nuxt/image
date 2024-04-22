import { joinURL } from "ufo";
import { createOperationsGenerator } from "@nuxt/image/dist/runtime/utils/index";
import type { ProviderGetImage } from "@nuxt/image";
import { Buffer } from "buffer";
import * as hash from "hash.js";

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    resize: "rs",
    size: "s",
    fit: "rt",
    width: "w",
    height: "h",
    dpr: "dpr",
    enlarge: "el",
    extend: "ex",
    gravity: "g",
    crop: "c",
    padding: "pd",
    trim: "t",
    rotate: "rot",
    quality: "q",
    maxBytes: "mb",
    background: "bg",
    backgroundAlpha: "bga",
    blur: "bl",
    sharpen: "sh",
    watermark: "wm",
    preset: "pr",
    cacheBuster: "cb",
    stripMetadata: "sm",
    stripColorProfile: "scp",
    autoRotate: "ar",
    filename: "fn",
    format: "f",
  },
  formatter: (key, value) => `${key}:${value}`,
});

function urlSafeBase64(string) {
  return Buffer.from(string, "utf8")
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const hexDecode = (hex: string) => Buffer.from(hex, "hex");

function sign(salt: string, target: string, secret: string) {
  const hmac = hash.hmac(hash.sha256, hexDecode(secret));
  hmac.update(hexDecode(salt));
  hmac.update(target);

  return urlSafeBase64(hmac.digest());
}

const defaultModifiers = {
  fit: "fill",
  width: 0,
  height: 0,
  gravity: "no",
  enlarge: 1,
  format: "webp",
};

export const getImage: ProviderGetImage = (src, options) => {
  const { modifiers, imgProxyUrl, imgProxySalt, imgProxyKey } = options;
  const mergeModifiers = { ...defaultModifiers, ...modifiers };
  const encodedUrl = urlSafeBase64(src);
  const path = joinURL("/", operationsGenerator(mergeModifiers), encodedUrl);
  const signature = sign(imgProxySalt, path, imgProxyKey);

  return {
    url: joinURL(imgProxyUrl, signature, path),
  };
};