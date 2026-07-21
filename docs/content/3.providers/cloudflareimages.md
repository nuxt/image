---
title: Cloudflare Images
description: Nuxt Image has first class integration with Cloudflare Images.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/cloudflareimages.ts
    size: xs
---

Integration between [Cloudflare Images](https://developers.cloudflare.com/images/) and the image module.

::note
This provider is for **Cloudflare Images** — the image hosting and delivery product where you upload images to Cloudflare and reference them by image ID. If you want to transform images on your own domain using **Cloudflare Image Transformations** (via `/cdn-cgi/image/`), use the [`cloudflare` provider](/providers/cloudflare) instead.
::

## Setup

You need your **account hash**, which you can find in the Cloudflare dashboard under **Images > Overview > Developer Resources**.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudflareimages: {
      accountHash: 'YOUR_ACCOUNT_HASH'
    }
  }
})
```

Images are referenced by their **image ID** (not a URL path):

```vue
<NuxtImg
  provider="cloudflareimages"
  src="083eb7b2-5392-4565-b69e-aff66acddd00"
  width="400"
  height="300"
/>
```

## Options

### `accountHash`

**Required.** Your Cloudflare Images account hash.

### `baseURL`

Default: `https://imagedelivery.net/`

The base URL for image delivery. You can change this if you are serving images through a [custom domain](https://developers.cloudflare.com/images/manage-images/serve-images/serve-from-custom-domains/).

## Variants vs. flexible transformations

Cloudflare Images supports two ways of serving images:

1. **Named variants** — Predefined sizes [configured in the Cloudflare dashboard](https://developers.cloudflare.com/images/manage-images/create-variants/) (e.g. `public`, `thumbnail`). Use the `variant` modifier.
2. **Flexible variants** — On-the-fly [transformations](https://developers.cloudflare.com/images/transform-images/transform-via-url/) using width, height, fit, etc. This must be enabled in your Cloudflare Images dashboard.

When you pass a `variant` modifier or no image modifiers at all, the provider uses the variant URL format. Otherwise, it uses flexible variant transformations.

```vue
<!-- Uses the 'public' variant (default when no modifiers) -->
<NuxtImg provider="cloudflareimages" src="my-image-id" />

<!-- Uses a named variant -->
<NuxtImg
  provider="cloudflareimages"
  src="my-image-id"
  :modifiers="{ variant: 'thumbnail' }"
/>

<!-- Uses flexible variants (requires enablement in dashboard) -->
<NuxtImg
  provider="cloudflareimages"
  src="my-image-id"
  width="400"
  height="300"
  fit="cover"
/>
```

## Modifiers

On top of the [standard modifiers](/usage/nuxt-img#modifiers), the following Cloudflare Images-specific modifiers are supported when using flexible variants:

| Modifier | Description |
|---|---|
| `variant` | Named variant to use (e.g. `public`, `thumbnail`). Takes priority over other modifiers. |
| `dpr` | Device pixel ratio multiplier. |
| `gravity` | Cropping gravity: `auto`, `face`, `left`, `right`, `top`, `bottom`. |
| `sharpen` | Sharpen amount (0-10). |
| `rotate` | Rotation angle: `90`, `180`, or `270`. |
| `brightness` | Brightness adjustment. |
| `contrast` | Contrast adjustment. |
| `gamma` | Gamma adjustment. |
| `saturation` | Saturation adjustment. |
| `anim` | `'true'` or `'false'` — whether to preserve animation frames. |
| `metadata` | Metadata handling: `copyright`, `keep`, or `none`. |
| `compression` | Set to `'fast'` for faster compression. |
| `flip` | Flip image: `h` (horizontal), `v` (vertical), or `hv` (both). |
| `zoom` | Zoom factor for use with `gravity: 'face'` (0-1). |

### `fit`

| Value | Cloudflare behavior |
|---|---|
| `cover` | Image covers the box, cropping if necessary. |
| `contain` | Image fits inside the box, preserving aspect ratio. |
| `fill` | Pads the image to fill the box. |
| `outside` | Crops the image to fill the box. |
| `inside` | Scales down to fit, never enlarging. |
