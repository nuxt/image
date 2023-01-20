import { trimExt, basename, join, dirname, relative, resolve, normalize } from 'upath';
import defu from 'defu';
import { parseURL, withoutTrailingSlash, joinURL, hasProtocol, withLeadingSlash } from 'ufo';
import LruCache from 'lru-cache';
import { createWriteStream, existsSync } from 'fs';
import { promisify } from 'util';
import stream from 'stream';
import path from 'path';
import { mkdirp, readFile, writeFile, writeJson } from 'fs-extra';
import { fetch } from 'node-fetch-native';
import hasha$1 from 'hasha';
import pLimit from 'p-limit';
import consola from 'consola';
import hasha from 'hasha/index.js';
import { update } from 'rc9';
import { lt } from 'semver';

const name = "@jthawme/nuxt-image";
const version = "0.8.4";

const logger = consola.withScope("@nuxt/image");
const pkg = { name, version };
function hash(value, length = 6) {
  return hasha(value).substr(0, length);
}
function pick(obj, keys) {
  const newobj = {};
  for (const key of keys) {
    newobj[key] = obj[key];
  }
  return newobj;
}
function guessExt(input = "") {
  const ext = input.split(".").pop()?.split("?")[0];
  if (ext && /^[\w0-9]+$/.test(ext)) {
    return "." + ext;
  }
  return "";
}

function getHash(input, url) {
  const staticFile = path.join(process.cwd(), "static", input);
  if (existsSync(staticFile)) {
    return hasha$1.fromFileSync(staticFile);
  }
  return hash(url);
}
function setupStaticGeneration(nuxt, options) {
  const staticImages = {};
  nuxt.hook("vue-renderer:ssr:prepareContext", (renderContext) => {
    renderContext.image = renderContext.image || {};
    renderContext.image.mapToStatic = function({ url, format }, input) {
      if (!staticImages[url]) {
        const { pathname } = parseURL(input);
        const params = {
          name: trimExt(basename(pathname)),
          ext: format && `.${format}` || guessExt(input),
          hash: getHash(input, url),
          publicPath: nuxt.options.app.cdnURL ? "/" : withoutTrailingSlash(nuxt.options.build.publicPath)
        };
        staticImages[url] = options.staticFilename.replace(/\[(\w+)]/g, (match, key) => params[key] || match);
      }
      return joinURL(nuxt.options.app.cdnURL || nuxt.options.app.basePath, staticImages[url]);
    };
  });
  nuxt.hook("generate:done", async () => {
    const limit = pLimit(8);
    const downloads = Object.entries(staticImages).map(([url, name]) => {
      if (!hasProtocol(url)) {
        url = joinURL(options.internalUrl, url);
      }
      return limit(() => downloadImage({
        url,
        name,
        outDir: nuxt.options.generate.dir
      }));
    });
    await Promise.all(downloads);
  });
}
const pipeline = promisify(stream.pipeline);
async function downloadImage({ url, name, outDir }) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Unexpected response ${response.statusText}`);
    }
    const dstFile = join(outDir, name);
    await mkdirp(dirname(dstFile));
    await pipeline(response.body, createWriteStream(dstFile));
    logger.success("Generated static image " + relative(process.cwd(), dstFile));
  } catch (error) {
    logger.error(error?.message);
  }
}

const ipxSetup = async (_providerOptions, moduleOptions, nuxt) => {
  const isStatic = nuxt.options.target === "static";
  const runtimeDir = resolve(__dirname, "runtime");
  const ipxOptions = {
    dir: resolve(nuxt.options.rootDir, moduleOptions.dir),
    domains: moduleOptions.domains,
    sharp: moduleOptions.sharp,
    alias: moduleOptions.alias
  };
  const hasUserProvidedIPX = !!nuxt.options.serverMiddleware.find((mw) => mw.path && mw.path.startsWith("/_ipx"));
  if (!hasUserProvidedIPX) {
    const { createIPX, createIPXMiddleware } = await import('ipx').catch((err) => {
      console.error("[@nuxt/image] `ipx` is an optional dependency for local image optimization and is not properly installed. Please try `npm install` or `yarn install` again.");
      throw new Error(err);
    });
    const ipx = createIPX(ipxOptions);
    nuxt.options.serverMiddleware.push({
      path: "/_ipx",
      handle: createIPXMiddleware(ipx)
    });
  }
  const installedInModules = nuxt.options.modules.some((mod) => typeof mod === "string" && mod.includes("@nuxt/image"));
  if (!isStatic && !hasUserProvidedIPX && !installedInModules && lt(nuxt.constructor.version, "2.16.0")) {
    console.warn("[@nuxt/image] If you would like to use the `ipx` provider at runtime.\nMake sure to follow the instructions at https://image.nuxtjs.org/providers/ipx .");
  }
  if (nuxt.options.dev || hasUserProvidedIPX) {
    return;
  }
  nuxt.hook("build:done", async () => {
    const handler = await readFile(resolve(runtimeDir, "ipx.js"), "utf-8");
    const distDir = resolve(nuxt.options.buildDir, "dist");
    const apiDir = resolve(distDir, "api");
    const apiFile = resolve(apiDir, "ipx.js");
    const relativeApiFile = "~~/" + relative(nuxt.options.rootDir, apiFile);
    await mkdirp(apiDir);
    await writeFile(apiFile, handler.replace(/.__IPX_OPTIONS__./, JSON.stringify(ipxOptions)));
    update({ serverMiddleware: [{ path: "/_ipx", handler: relativeApiFile }] }, { dir: distDir, name: "nuxtrc" });
  });
};

const BuiltInProviders = [
  "cloudflare",
  "cloudinary",
  "contentful",
  "cloudimage",
  "fastly",
  "glide",
  "imagekit",
  "gumlet",
  "imgix",
  "ipx",
  "netlify",
  "layer0",
  "prismic",
  "sanity",
  "static",
  "twicpics",
  "strapi",
  "storyblok",
  "unsplash",
  "vercel",
  "imageengine"
];
const providerSetup = {
  ipx: ipxSetup,
  static: ipxSetup,
  async vercel(_providerOptions, moduleOptions, nuxt) {
    const imagesConfig = resolve(nuxt.options.rootDir, ".vercel_build_output/config/images.json");
    await mkdirp(dirname(imagesConfig));
    await writeJson(imagesConfig, {
      domains: moduleOptions.domains,
      sizes: Array.from(new Set(Object.values(moduleOptions.screens || {})))
    });
  }
};
function resolveProviders(nuxt, options) {
  const providers = [];
  for (const key in options) {
    if (BuiltInProviders.includes(key)) {
      providers.push(resolveProvider(nuxt, key, { provider: key, options: options[key] }));
    }
  }
  for (const key in options.providers) {
    providers.push(resolveProvider(nuxt, key, options.providers[key]));
  }
  return providers;
}
function resolveProvider(nuxt, key, input) {
  if (typeof input === "string") {
    input = { name: input };
  }
  if (!input.name) {
    input.name = key;
  }
  if (!input.provider) {
    input.provider = input.name;
  }
  input.provider = BuiltInProviders.includes(input.provider) ? require.resolve("./runtime/providers/" + input.provider) : nuxt.resolver.resolvePath(input.provider);
  const setup = input.setup || providerSetup[input.name];
  return {
    ...input,
    setup,
    runtime: normalize(input.provider),
    importName: `${key}Runtime$${hash(input.provider, 4)}`,
    runtimeOptions: input.options
  };
}
function detectProvider(userInput, isStatic = false) {
  if (process.env.NUXT_IMAGE_PROVIDER) {
    return process.env.NUXT_IMAGE_PROVIDER;
  }
  if (userInput && userInput !== "auto") {
    return userInput;
  }
  if (process.env.VERCEL || process.env.VERCEL_ENV || process.env.NOW_BUILDER) {
    return "vercel";
  }
  return isStatic ? "static" : "ipx";
}

const imageModule = async function imageModule2(moduleOptions) {
  const { nuxt, addPlugin } = this;
  const defaults = {
    staticFilename: "[publicPath]/image/[hash][ext]",
    provider: "auto",
    presets: {},
    dir: resolve(nuxt.options.srcDir, nuxt.options.dir.static),
    domains: [],
    sharp: {},
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      "2xl": 1536
    },
    internalUrl: "",
    providers: {},
    static: {},
    alias: {}
  };
  const options = defu(moduleOptions, nuxt.options.image, defaults);
  options.domains = options.domains.map((d) => {
    if (!d.startsWith("http")) {
      d = "http://" + d;
    }
    return new URL(d).hostname;
  }).filter(Boolean);
  options.alias = Object.fromEntries(Object.entries(options.alias).map((e) => [withLeadingSlash(e[0]), e[1]]));
  options.provider = detectProvider(options.provider, nuxt.options.target === "static");
  options[options.provider] = options[options.provider] || {};
  const imageOptions = pick(options, [
    "screens",
    "presets",
    "provider",
    "domains",
    "alias"
  ]);
  const providers = resolveProviders(nuxt, options);
  for (const p of providers) {
    if (typeof p.setup === "function") {
      await p.setup(p, options, nuxt);
    }
  }
  const runtimeDir = resolve(__dirname, "runtime");
  nuxt.options.alias["~image"] = runtimeDir;
  nuxt.options.build.transpile.push(runtimeDir, "@nuxt/image", "allowlist", "defu", "ufo");
  addPlugin({
    fileName: "image.js",
    src: resolve(runtimeDir, "plugin.js"),
    options: {
      imageOptions,
      providers
    }
  });
  nuxt.options.build.loaders = defu({
    vue: { transformAssetUrls: { "nuxt-img": "src", "nuxt-picture": "src", NuxtPicture: "src", NuxtImg: "src" } }
  }, nuxt.options.build.loaders || {});
  nuxt.hook("generate:before", () => {
    setupStaticGeneration(nuxt, options);
  });
  const cache = new LruCache({ max: 1e3 });
  nuxt.hook("vue-renderer:context", (ssrContext) => {
    ssrContext.cache = cache;
  });
  nuxt.hook("listen", (_, listener) => {
    options.internalUrl = `http://localhost:${listener.port}`;
  });
};
imageModule.meta = pkg;

export { imageModule as default };
