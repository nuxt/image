'use strict';

const upath = require('upath');
const defu = require('defu');
const ufo = require('ufo');
const LruCache = require('lru-cache');
const fs = require('fs');
const util = require('util');
const stream = require('stream');
const path = require('path');
const fsExtra = require('fs-extra');
const nodeFetchNative = require('node-fetch-native');
const hasha$1 = require('hasha');
const pLimit = require('p-limit');
const consola = require('consola');
const hasha = require('hasha/index.js');
const rc9 = require('rc9');
const semver = require('semver');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const defu__default = /*#__PURE__*/_interopDefaultLegacy(defu);
const LruCache__default = /*#__PURE__*/_interopDefaultLegacy(LruCache);
const stream__default = /*#__PURE__*/_interopDefaultLegacy(stream);
const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const hasha__default$1 = /*#__PURE__*/_interopDefaultLegacy(hasha$1);
const pLimit__default = /*#__PURE__*/_interopDefaultLegacy(pLimit);
const consola__default = /*#__PURE__*/_interopDefaultLegacy(consola);
const hasha__default = /*#__PURE__*/_interopDefaultLegacy(hasha);

const name = "@jthawme/nuxt-image";
const version = "0.8.4";

const logger = consola__default.withScope("@nuxt/image");
const pkg = { name, version };
function hash(value, length = 6) {
  return hasha__default(value).substr(0, length);
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
  const staticFile = path__default.join(process.cwd(), "static", input);
  if (fs.existsSync(staticFile)) {
    return hasha__default$1.fromFileSync(staticFile);
  }
  return hash(url);
}
function setupStaticGeneration(nuxt, options) {
  const staticImages = {};
  nuxt.hook("vue-renderer:ssr:prepareContext", (renderContext) => {
    renderContext.image = renderContext.image || {};
    renderContext.image.mapToStatic = function({ url, format }, input) {
      if (!staticImages[url]) {
        const { pathname } = ufo.parseURL(input);
        const params = {
          name: upath.trimExt(upath.basename(pathname)),
          ext: format && `.${format}` || guessExt(input),
          hash: getHash(input, url),
          publicPath: nuxt.options.app.cdnURL ? "/" : ufo.withoutTrailingSlash(nuxt.options.build.publicPath)
        };
        staticImages[url] = options.staticFilename.replace(/\[(\w+)]/g, (match, key) => params[key] || match);
      }
      return ufo.joinURL(nuxt.options.app.cdnURL || nuxt.options.app.basePath, staticImages[url]);
    };
  });
  nuxt.hook("generate:done", async () => {
    const limit = pLimit__default(8);
    const downloads = Object.entries(staticImages).map(([url, name]) => {
      if (!ufo.hasProtocol(url)) {
        url = ufo.joinURL(options.internalUrl, url);
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
const pipeline = util.promisify(stream__default.pipeline);
async function downloadImage({ url, name, outDir }) {
  try {
    const response = await nodeFetchNative.fetch(url);
    if (!response.ok) {
      throw new Error(`Unexpected response ${response.statusText}`);
    }
    const dstFile = upath.join(outDir, name);
    await fsExtra.mkdirp(upath.dirname(dstFile));
    await pipeline(response.body, fs.createWriteStream(dstFile));
    logger.success("Generated static image " + upath.relative(process.cwd(), dstFile));
  } catch (error) {
    logger.error(error?.message);
  }
}

const ipxSetup = async (_providerOptions, moduleOptions, nuxt) => {
  const isStatic = nuxt.options.target === "static";
  const runtimeDir = upath.resolve(__dirname, "runtime");
  const ipxOptions = {
    dir: upath.resolve(nuxt.options.rootDir, moduleOptions.dir),
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
  if (!isStatic && !hasUserProvidedIPX && !installedInModules && semver.lt(nuxt.constructor.version, "2.16.0")) {
    console.warn("[@nuxt/image] If you would like to use the `ipx` provider at runtime.\nMake sure to follow the instructions at https://image.nuxtjs.org/providers/ipx .");
  }
  if (nuxt.options.dev || hasUserProvidedIPX) {
    return;
  }
  nuxt.hook("build:done", async () => {
    const handler = await fsExtra.readFile(upath.resolve(runtimeDir, "ipx.js"), "utf-8");
    const distDir = upath.resolve(nuxt.options.buildDir, "dist");
    const apiDir = upath.resolve(distDir, "api");
    const apiFile = upath.resolve(apiDir, "ipx.js");
    const relativeApiFile = "~~/" + upath.relative(nuxt.options.rootDir, apiFile);
    await fsExtra.mkdirp(apiDir);
    await fsExtra.writeFile(apiFile, handler.replace(/.__IPX_OPTIONS__./, JSON.stringify(ipxOptions)));
    rc9.update({ serverMiddleware: [{ path: "/_ipx", handler: relativeApiFile }] }, { dir: distDir, name: "nuxtrc" });
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
    const imagesConfig = upath.resolve(nuxt.options.rootDir, ".vercel_build_output/config/images.json");
    await fsExtra.mkdirp(upath.dirname(imagesConfig));
    await fsExtra.writeJson(imagesConfig, {
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
    runtime: upath.normalize(input.provider),
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
    dir: upath.resolve(nuxt.options.srcDir, nuxt.options.dir.static),
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
  const options = defu__default(moduleOptions, nuxt.options.image, defaults);
  options.domains = options.domains.map((d) => {
    if (!d.startsWith("http")) {
      d = "http://" + d;
    }
    return new URL(d).hostname;
  }).filter(Boolean);
  options.alias = Object.fromEntries(Object.entries(options.alias).map((e) => [ufo.withLeadingSlash(e[0]), e[1]]));
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
  const runtimeDir = upath.resolve(__dirname, "runtime");
  nuxt.options.alias["~image"] = runtimeDir;
  nuxt.options.build.transpile.push(runtimeDir, "@nuxt/image", "allowlist", "defu", "ufo");
  addPlugin({
    fileName: "image.js",
    src: upath.resolve(runtimeDir, "plugin.js"),
    options: {
      imageOptions,
      providers
    }
  });
  nuxt.options.build.loaders = defu__default({
    vue: { transformAssetUrls: { "nuxt-img": "src", "nuxt-picture": "src", NuxtPicture: "src", NuxtImg: "src" } }
  }, nuxt.options.build.loaders || {});
  nuxt.hook("generate:before", () => {
    setupStaticGeneration(nuxt, options);
  });
  const cache = new LruCache__default({ max: 1e3 });
  nuxt.hook("vue-renderer:context", (ssrContext) => {
    ssrContext.cache = cache;
  });
  nuxt.hook("listen", (_, listener) => {
    options.internalUrl = `http://localhost:${listener.port}`;
  });
};
imageModule.meta = pkg;

module.exports = imageModule;
