````mdc
---
title: Flyimg
description: Nuxt Image has first class integration with Flyimg.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/flyimg.ts
    size: xs
---

Integration between [Flyimg](https://flyimg.io) and the image module.

[Flyimg](https://github.com/flyimg/flyimg) is a self-hosted, open-source image processing server built on ImageMagick. It accepts images from a source URL and applies transformations on the fly, caching results for subsequent requests. A managed SaaS version is also available at [flyimg.io](https://flyimg.io).

## Setup

### Self‑hosted

`baseURL` points to your **Flyimg server**. If you use relative image paths (e.g. `<NuxtImg src="/images/photo.jpg" />`), also set `sourceURL` to your **website's public URL** so that Flyimg can fetch the source image — it requires an absolute URL. Absolute `src` values (e.g. from a CDN) are passed through as-is and `sourceURL` is ignored for those.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    flyimg: {
      // URL of your Flyimg server
      baseURL: 'https://flyimg.example.com',
      // Public URL of your website — only needed for relative image paths
      sourceURL: 'https://www.example.com',
    }
  }
})
```

::callout{type="warning"}
**nginx users:** nginx's default `merge_slashes on` setting collapses consecutive slashes in URLs, which corrupts the embedded `https://` in Flyimg request paths (e.g. `https://flyimg.example.com/upload/-/https://www.example.com/photo.jpg`). Add `merge_slashes off;` to the `server` block of your nginx config when reverse-proxying requests to Flyimg.
::

### Flyimg SaaS

After [creating an instance](https://flyimg.io/documentation) you receive a unique subdomain (e.g. `img-abc123.flyimg.io`):

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    flyimg: {
      // Unique subdomain provided by Flyimg SaaS
      baseURL: 'https://img-abc123.flyimg.io',
      // Public URL of your website — only needed for relative image paths
      sourceURL: 'https://www.example.com',
    }
  }
})
```

## Options

| Option | Default | Description |
|---|---|---|
| `baseURL` | — | **Required.** URL of your Flyimg server or SaaS instance. |
| `sourceURL` | — | Public base URL of your website. Only used for relative image paths — prefixed to make them absolute before passing to Flyimg. Absolute `src` values are unaffected. |
| `processType` | `upload` | Flyimg process type: `upload` (serve the image) or `path` (return the path as text). |

## Modifiers

In addition to the standard `width`, `height`, `quality`, `format`, and `fit` modifiers, the Flyimg provider exposes the full range of [Flyimg URL options](https://docs.flyimg.io/url-options/).

### `fit`

| Nuxt Image value | Flyimg behaviour |
|---|---|
| `contain` / `inside` | Scale to fit within the target rectangle preserving aspect ratio (Flyimg default) |
| `cover` | Crop to fill the rectangle (`c_1`) |
| `fill` | Stretch to fill without preserving aspect ratio (`par_0`) |
| `outside` | ⚠️ Unsupported — ignored (dev-time warning emitted) |

### Additional Flyimg modifiers

```vue
<NuxtImg
  provider="flyimg"
  src="/photo.jpg"
  width="800"
  :modifiers="{
    gravity: 'NorthEast',
    sharpen: '0x5',
    background: '#ffffff',
    strip: false,
  }"
/>
```

Refer to the [Flyimg URL options documentation](https://docs.flyimg.io/url-options/) for the full list of supported parameters.
````
