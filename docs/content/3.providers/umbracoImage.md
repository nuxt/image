---
title: Umbraco
description: Nuxt Image has first class integration with Umbraco.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/jemomi/nuxt-image/blob/main/src/runtime/providers/umbracoImage.ts
    size: xs
---

Integration between [Umbraco](https://umbraco.com) and the image module.

This provider is designed for images served through Umbraco's built-in ImageSharp-based image processing pipeline.

To use this provider, configure the base URL of your Umbraco site:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    umbracoImage: {
      baseURL: 'https://your-umbraco-site.com'
    }
  }
})
```

You can then use the provider with `NuxtImg` or `NuxtPicture`:

```vue
<NuxtImg
  provider="umbracoImage"
  src="/media/abcd1234/example.jpg"
  width="800"
  height="450"
  format="webp"
  :quality="80"
/>
```

## Options

### `baseURL`

- Type: **String**
- Default: `''`

Base URL for your Umbraco site. This is prepended to relative image paths such as `/media/...`.

If you already pass absolute Umbraco media URLs as `src`, `baseURL` can be omitted:

```vue
<NuxtImg
  provider="umbracoImage"
  src="https://your-umbraco-site.com/media/abcd1234/example.jpg"
  width="800"
  height="450"
/>
```

## Modifiers

The Umbraco provider maps Nuxt Image modifiers to Umbraco/ImageSharp query parameters:

| Nuxt modifier | Query parameter | Description |
| --- | --- | --- |
| `width` | `width` | Output width in pixels |
| `height` | `height` | Output height in pixels |
| `format` | `format` | Output format, for example `webp`, `jpg`, `png` |
| `quality` | `quality` | Encoder quality |
| `fit` | `rmode` | Resize mode |
| `sampler` | `rsampler` | Resampling algorithm |
| `anchorPosition` | `ranchor` | Anchor position for crop/pad operations |
| `focalPointXY` | `rxy` | Exact focal point as `x,y` values between `0` and `1` |

If only one of `width` or `height` is provided, the original aspect ratio is preserved.

### `fit`

Supported values:

- `boxpad`
- `crop`
- `manual`
- `max`
- `min`
- `pad`
- `stretch`
- `contain`
- `cover`

The standard Nuxt Image values `contain` and `cover` are mapped to their ImageSharp equivalents: `contain` becomes `rmode=max` and `cover` becomes `rmode=crop`.

```vue
<NuxtImg
  provider="umbracoImage"
  src="/media/abcd1234/example.jpg"
  width="1200"
  height="630"
  fit="max"
/>
```

### `focalPointXY`

Use `focalPointXY` when you want to crop around an exact focal point. The value must be a comma-separated `x,y` pair between `0` and `1`.

```vue
<NuxtImg
  provider="umbracoImage"
  src="/media/abcd1234/example.jpg"
  width="400"
  height="400"
  format="webp"
  :modifiers="{ focalPointXY: '0.55,0.58', fit: 'crop' }"
/>
```

### `anchorPosition`

Use `anchorPosition` to control how the image is anchored when using resize modes such as `crop` or `pad`.

Supported values:

- `top`
- `topleft`
- `topright`
- `left`
- `center`
- `right`
- `bottom`
- `bottomleft`
- `bottomright`

```vue
<NuxtImg
  provider="umbracoImage"
  src="/media/abcd1234/example.jpg"
  width="800"
  height="400"
  :modifiers="{ fit: 'crop', anchorPosition: 'top' }"
/>
```

### `sampler`

Use `sampler` to control the resampling algorithm used during resize operations.

Supported values:

- `bicubic`
- `nearest`
- `box`
- `mitchell`
- `catmull`
- `lanczos2`
- `lanczos3`
- `lanczos5`
- `lanczos8`
- `welch`
- `robidoux`
- `robidouxsharp`
- `spline`
- `triangle`
- `hermite`

```vue
<NuxtImg
  provider="umbracoImage"
  src="/media/abcd1234/example.jpg"
  width="600"
  height="338"
  :modifiers="{ sampler: 'lanczos3' }"
/>
```

## Notes

### ImageSharp and Umbraco processing

Umbraco uses ImageSharp.Web for image processing, so this provider works by generating the same query parameters Umbraco already understands for resize, format, quality, focal point and related operations.

### Set crops

Umbraco supports using set crops for images. These however, aren't currently supported.

### HMAC protected image URLs

If your Umbraco setup has `Umbraco:CMS:Imaging:HMACSecretKey` enabled, image requests can require an HMAC signature.

This provider does not currently generate that signature, so transformed URLs may be rejected unless signing is handled elsewhere.

### Resize limits

Umbraco can enforce maximum resize dimensions through its imaging settings. If the requested dimensions exceed your configured limits, resizing may not be applied.

## Example

```vue
<template>
  <NuxtImg
    provider="umbracoImage"
    src="/media/hvjlhtfw/home-full-screen-4.png"
    width="500"
    height="200"
    format="webp"
    :quality="60"
    :modifiers="{
      fit: 'crop',
      focalPointXY: '0.5488476724567298,0.5772994963168611'
    }"
  />
</template>
```

## More information

For the underlying processing behavior and available resize semantics, see the [Umbraco Image Cropper docs](https://docs.umbraco.com/umbraco-cms/fundamentals/backoffice/property-editors/built-in-umbraco-property-editors/image-cropper) and the [ImageSharp processing commands docs](https://docs.sixlabors.com/articles/imagesharp.web/processingcommands.html).
