---
title: Uploadcare
description: Power up file uploading, processing and delivery for your app in one sitting.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/uploadcare.ts
    size: xs
---

Integration between [Uploadcare](https://uploadcare.com) and the Nuxt Image module.

## Usage
To use images from uploadcare, specify the provider as `uploadcare` and set the image src to the UUID provided on the dashboard.

```vue [page.vue]
<NuxtImg
  provider="uploadcare"
  src="c160afba-8b42-45a9-a46a-d393248b0072"
  alt="My image from uploadcare"
/>
```

## Modifiers
To see all possible modifiers and their options, check out the [image transformations documentation](https://uploadcare.com/docs/transformations/image) or the [URL API Reference](https://uploadcare.com/api-refs/url-api).

Types are provided for the following modifiers:
```ts [src/types/module.ts]
// Image Compression
format: 'jpeg' | 'png' | 'webp' | 'auto'
quality: 'smart' | 'smart_retina' | 'normal' | 'better' | 'best' | 'lighter' | 'lightest'
progressive: 'yes' | 'no'
strip_meta: 'all' | 'none' | 'sensitive'

// Image Geometry
preview: `${number}x${number}` // Height x Width
resize: `${number}x${number}` | `${number}x`| `x${number}` 
smart_resize: `${number}x${number}`
crop: string | string[]
scale_crop: string | string[]
border_radius: string | string[]
setfill: string // 3, 6 or 8 digit hex color
zoom_objects: string // 1 to 100
```

Please feel free to open a PR to improve support for additional operations.

## Configuration

> By default, all file URLs use the `ucarecdn.com` domain. By setting a custom CDN CNAME, file URLs can use `cdn.mycompany.com` instead.

See the [Uploadcare documentation](https://uploadcare.com/docs/delivery/cdn/#custom-cdn-cname) for how to enable a custom domain in your project. To tell Nuxt Image about the custom CDN name, use the following configuration:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    uploadcare: {
      cdnURL: 'cdn.mycompany.com'
    }
  }
})
```
