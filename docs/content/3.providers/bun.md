---
title: Bun
description: Self-hosted image optimizer powered by Bun.Image, with no native dependencies.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/bun.ts
    size: xs
---

The `bun` provider transforms images with [`Bun.Image`](https://bun.com/docs/runtime/image), the image pipeline built into the Bun runtime. It is the self-hosted alternative to [ipx](/providers/ipx): the same URLs and modifier names, but no `sharp`, no native binaries and no `@img/*` packages to install or trace into your build.

::warning
The `bun` provider needs **Bun 1.4.0 or newer** wherever images are transformed: the dev server, the production server, and the build process when you prerender. See [Running on Bun](#running-on-bun).
::

## Support matrix

`Bun.Image` implements a subset of what Sharp offers. Every modifier ipx accepts is listed below with its status on the `bun` provider. Modifiers marked ❌ or ⏳ are ignored and produce a console warning (see [Unsupported modifiers](#unsupported-modifiers)).

Legend: ✅ Works as with ipx · 🟡 Partial or emulated, read the note · ⏳ Waits on an open Bun pull request · ❌ Not available, a console warning is emitted.

| Status | Modifier | ipx / Sharp | Bun.Image | Note |
| :---: | --- | --- | --- | --- |
| ✅ | `width`, `w` | resize width | resize width |  |
| ✅ | `height`, `h` | resize height | resize height | Source size is read first. |
| ✅ | `resize`, `s` | resize W×H | resize W×H | Default fit differs, see fit. |
| ✅ | `enlarge` | allow upscale | withoutEnlargement: false |  |
| ✅ | `kernel` | resampling kernel | filter | Same names plus mks2013, mks2021, box. |
| ✅ | `format`, `f` | jpeg, png, webp, avif, heif, gif, tiff | jpeg, png, webp, avif, heic | No gif or tiff output. avif and heic need OS codecs, none on Linux. Falls back with a warning. |
| ✅ | `quality`, `q` | 1-100 | 1-100 | Ignored for png. |
| ✅ | `flip`, `flop` | mirror | mirror |  |
| ✅ | `grayscale` | desaturate | modulate({ saturation: 0 }) |  |
| ✅ | `brightness`, `saturation` | modulate | modulate |  |
| ✅ | `autoorient` | apply EXIF | on by default |  |
| 🟡 | `fit` | contain, cover, fill, inside, outside | fill, inside | cover, contain and outside are emulated without cropping or padding unless the runtime supports them natively ([oven-sh/bun#30616](https://github.com/oven-sh/bun/pull/30616)). |
| 🟡 | `rotate` | any angle | multiples of 90 | Other angles return 400. |
| 🟡 | `modulate` | brightness, saturation, hue, lightness | brightness, saturation | hue and lightness positions are ignored. |
| 🟡 | `background`, `b` | fill colour for contain, extend, rotate, flatten | resize background | Only used with native contain ([oven-sh/bun#30616](https://github.com/oven-sh/bun/pull/30616)). |
| 🟡 | `animated`, `a` | keep frames | first frame only |  |
| ⏳ | `extract`, `crop` | crop region | none | [oven-sh/bun#40379](https://github.com/oven-sh/bun/pull/40379). |
| ⏳ | `opacity` | composite overlay | none | Needs composite, [oven-sh/bun#31670](https://github.com/oven-sh/bun/pull/31670). |
| ⏳ | `tint` | tint | none | Needs raw pixel access, [oven-sh/bun#31670](https://github.com/oven-sh/bun/pull/31670). |
| ❌ | `position`, `pos` | crop gravity | none | Bun.Image has no crop gravity; cover is centre-crop only. |
| ❌ | `trim` | trim edges | none | Bun.Image has no trim operation. |
| ❌ | `extend` | pad canvas | none | Bun.Image has no extend operation. |
| ❌ | `sharpen` | unsharp mask | none | Bun.Image has no sharpen operation. |
| ❌ | `median` | median filter | none | Bun.Image has no median filter. |
| ❌ | `blur` | gaussian blur | none | Bun.Image has no blur operation. |
| ❌ | `dilate`, `erode` | morphology | none | Bun.Image has no morphology operations. |
| ❌ | `clahe` | contrast equalisation | none | Bun.Image has no CLAHE operation. |
| ❌ | `flatten`, `unflatten` | alpha handling | none | Bun.Image has no flatten or unflatten operation. |
| ❌ | `gamma` | gamma curve | none | Bun.Image has no gamma operation. |
| ❌ | `negate` | invert | none | Bun.Image has no negate operation. |
| ❌ | `normalize` | stretch histogram | none | Bun.Image has no normalize operation. |
| ❌ | `threshold` | binarise | none | Bun.Image has no threshold operation. |
| ❌ | `linear` | a·x + b | none | Bun.Image has no linear operation. |
| ❌ | `hue`, `lightness` | modulate channel | none | Bun.Image modulate has no hue or lightness. |

Bun-only encoder options are also accepted as modifiers: `progressive` (JPEG), `lossless` (WebP), `palette`, `colors`, `dither` and `compressionLevel` (PNG).

### Output formats by platform

| Format | Linux | macOS | Windows |
| --- | :---: | :---: | :---: |
| JPEG, PNG, WebP | ✅ | ✅ | ✅ |
| AVIF | ❌ falls back to WebP | ✅ decode, encode on Apple Silicon M3+ | ✅ with the AV1 Video Extension |
| HEIC | ❌ falls back to JPEG | ✅ | ✅ with the HEIF Image Extensions |
| GIF, TIFF | ❌ falls back to WebP / PNG | ❌ falls back | ❌ falls back |

When a format cannot be encoded on the current machine the provider logs one warning and serves the fallback. Keep the module default of `format: ['webp']` on Linux hosts; with `<NuxtPicture format="avif,webp">` the AVIF source would receive WebP bytes.

Sources `Bun.Image` cannot decode are served untouched with a warning: SVG, animated WebP, and AVIF, HEIC or TIFF on platforms without a codec. Animated GIFs are decoded to their first frame unless the `animated` modifier is set, in which case the file is served untouched.

## Unsupported modifiers

Whenever a `<NuxtImg>`, `<NuxtPicture>`, `useImage()` or `$img` call passes a modifier from the ❌ or ⏳ rows, the provider warns once per modifier name:

```
[@nuxt/image] The "blur" modifier is not supported by the bun provider (Bun.Image has no blur operation) and was ignored for "/images/hero.jpg". See https://image.nuxt.com/providers/bun#support-matrix
```

The warning fires where the URL is generated (during SSR and in the browser) and again on the server for hand-written URLs. The `unsupported` option controls it:

| Value | URL generation | Server |
| --- | --- | --- |
| `'warn'` (default) | `console.warn` once per modifier | log once per modifier, apply what it can |
| `'error'` | `console.warn` | respond `400` naming the modifier |
| `'silent'` | nothing | nothing |

### Fit modes

Bun 1.4 resizes with `fill` and `inside` only. `cover` (the default when both `width` and `height` are given, matching ipx), `outside` and `contain` are emulated: the image is scaled so it covers or fits the box, but it is neither cropped nor padded, so the output can be larger or smaller than the box on one axis. Use CSS `object-fit` on the `<img>` when the exact box matters, or set `defaultFit: 'inside'`. Native support is detected at startup, so once Bun ships the remaining fit modes the provider uses them without a change.

## Configuration

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    provider: 'bun', // or leave 'auto' and run on Bun
    bun: {
      baseURL: '/_bun',
      maxAge: 60,
      maxOutputDimension: 8192,
      maxPixels: 268_435_456,
      fs: { dir: 'public', maxAge: 60 },
      http: { domains: ['images.unsplash.com'], maxAge: 300 },
      unsupported: 'warn',
      defaultFit: 'cover',
      defaults: {
        jpeg: { progressive: true },
        webp: {},
        png: {},
      },
    },
  },
})
```

| Option | Default | Description |
| --- | --- | --- |
| `baseURL` | `/_bun` | Route the handler is mounted on. |
| `maxAge` | `60` | Default `cache-control` max-age in seconds. |
| `maxOutputDimension` | `8192` | Cap on output width and height, `false` to disable. |
| `maxPixels` | Bun default | Reject sources with more pixels, before decoding. |
| `fs` | `{ dir: <public dirs> }` | Local storage. `false` to disable. Accepts `maxAge` and `allowSymlinksOutsideDir`. |
| `http` | `{ domains: <image.domains> }` | Remote storage. `false` to disable. Accepts `allowAllDomains`, `maxAge`, `ignoreCacheControl`, `fetchOptions`. |
| `unsupported` | `'warn'` | What to do with modifiers Bun.Image cannot apply. |
| `defaultFit` | `'cover'` | Fit used when both `width` and `height` are given without `fit`. |
| `defaults` | `{}` | Per-format encoder defaults. |

The option shape mirrors ipx, so switching engines is a one-line change. [Aliases](/get-started/configuration#alias) and [domains](/get-started/configuration#domains) apply to both.

## Running on Bun

`Bun.Image` only exists inside the Bun runtime, so:

- **Development**: start with `bun --bun nuxt dev`. Under Node the module warns at startup and image requests fail with a clear `500`.
- **Production**: build with `NITRO_PRESET=bun` (or `nitro.preset: 'bun'`) and run `bun .output/server/index.mjs`.
- **Static sites**: `nuxt generate` transforms images inside the build process, so run `bun --bun nuxt generate`. The provider is then `bunStatic`, the counterpart of `ipxStatic`.

With `provider: 'auto'` the module picks the engine whose options are configured (`image.bun` or `image.ipx`). When neither or both are configured it picks `bun` when the build runs on Bun or targets the `bun` preset, `ipx` when that package is installed, and warns otherwise.

## Runtime configuration

Options can be overridden at runtime through `runtimeConfig.bunImage`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  runtimeConfig: {
    bunImage: {
      baseURL: process.env.NUXT_BUN_IMAGE_BASE_URL || '/_bun',
      http: {
        domains: process.env.NUXT_BUN_IMAGE_HTTP_DOMAINS,
      },
    },
  },
})
```
