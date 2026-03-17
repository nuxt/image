---
title: Tencent Cloud
description: Use Tencent Cloud COS imageMogr2 for image processing.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/tencentCloud.ts
    size: xs
---

Integration with Tencent Cloud COS Cloud Infinite (CI) image processing (`imageMogr2`). Supports resizing, cropping, rotation, format conversion, quality control, Gaussian blur, sharpening, and more.

## Setup

Set the bucket domain as `baseURL` in `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    tencentCloud: {
      baseURL: 'https://<bucket>.cos.<region>.myqcloud.com'
    }
  }
})
```

::note
`baseURL` should point to a publicly accessible COS bucket domain (or a bound CDN domain). No trailing slash is needed.
::

## Basic Usage

```vue
<NuxtImg
  provider="tencentCloud"
  src="/path/to/image.png"
  width="600"
  height="400"
  fit="cover"
  :modifiers="{ quality: 80, format: 'webp' }"
/>
```

## Standard Modifiers

All 7 standard NuxtImg modifiers are mapped to COS imageMogr2:

| Modifier | COS Mapping | Description |
|---|---|---|
| `width` / `height` | `/thumbnail/<W>x<H>` | Proportional scaling, affected by `fit` |
| `fit` | thumbnail suffix | `contain` → `<W>x<H>`, `cover` → `!<W>x<H>r`, `fill` → `<W>x<H>!` |
| `quality` | `/quality/<Q>` | Quality 1-100 |
| `format` | `/format/<f>` | Output format, `jpeg` is auto-mapped to `jpg` |
| `background` | `/pad/1/color/<base64>` | Used with scaling, fills background color |
| `blur` | `/blur/<n>x<n>` | Gaussian blur |

## COS Extended Modifiers

Pass Tencent Cloud-specific image processing parameters via the `:modifiers` prop:

| Modifier | COS Mapping | Description |
|---|---|---|
| `crop` | `/crop/<W>x<H>` | Regular crop (independent of scaling) |
| `gravity` | `/gravity/<pos>` | Crop anchor: center, north, south, west, east, northwest, etc. |
| `dx` / `dy` | `/dx/<n>/dy/<n>` | Crop offset |
| `iradius` | `/iradius/<r>` | Inscribed circle crop radius |
| `scrop` | `/scrop/<W>x<H>` | Smart face crop |
| `rotate` | `/rotate/<deg>` | Clockwise rotation 0-360° |
| `autoOrient` | `/auto-orient` | Auto-rotate based on EXIF orientation |
| `sharpen` | `/sharpen/<v>` | Sharpen |
| `strip` | `/strip` | Strip EXIF metadata |
| `interlace` | `/interlace/1` | Progressive JPEG/GIF |
| `pad` | `/pad/1` | Pad mode (used with background) |

## Examples

### Resize + Format + Quality

```vue
<NuxtImg
  provider="tencentCloud"
  src="/photos/banner.png"
  width="1200"
  height="500"
  fit="cover"
  :modifiers="{ quality: 85, format: 'webp' }"
/>
```

Generated URL: `?imageMogr2/thumbnail/!1200x500r/quality/85/format/webp`

### Crop + Gravity

```vue
<NuxtImg
  provider="tencentCloud"
  src="/photos/portrait.jpg"
  :modifiers="{ crop: '300x300', gravity: 'center' }"
/>
```

Generated URL: `?imageMogr2/crop/300x300/gravity/center`

### Rotate + Sharpen + Strip Metadata

```vue
<NuxtImg
  provider="tencentCloud"
  src="/photos/landscape.jpg"
  :modifiers="{ rotate: 90, sharpen: 70, strip: true }"
/>
```

Generated URL: `?imageMogr2/rotate/90/sharpen/70/strip`

### Gaussian Blur (Placeholder Effect)

```vue
<NuxtImg
  provider="tencentCloud"
  src="/photos/hero.jpg"
  width="100"
  :modifiers="{ blur: 20, quality: 10 }"
/>
```

Generated URL: `?imageMogr2/thumbnail/100x/quality/10/blur/20x20`

### Smart Face Crop

```vue
<NuxtImg
  provider="tencentCloud"
  src="/photos/group.jpg"
  :modifiers="{ scrop: '200x200' }"
/>
```

Generated URL: `?imageMogr2/scrop/200x200`

## References

- [COS imageMogr2 Scaling](https://cloud.tencent.com/document/product/436/44880)
- [COS imageMogr2 Cropping](https://cloud.tencent.com/document/product/436/44881)
- [COS imageMogr2 Rotation](https://cloud.tencent.com/document/product/436/44882)
- [COS imageMogr2 Format Conversion](https://cloud.tencent.com/document/product/436/44883)
- [COS imageMogr2 Quality](https://cloud.tencent.com/document/product/436/44884)
- [COS imageMogr2 Gaussian Blur](https://cloud.tencent.com/document/product/436/44885)
- [COS imageMogr2 Sharpen](https://cloud.tencent.com/document/product/436/44886)
