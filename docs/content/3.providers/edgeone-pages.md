---
title: EdgeOne Pages
description: Use EdgeOne Pages imageMogr2 for image processing.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/edgeonePages.ts
    size: xs
---

Integration with EdgeOne Pages image processing (`imageMogr2`). Supports resizing, cropping, rotation, format conversion, quality control, Gaussian blur, sharpening, and more.

## Setup

Set the site domain as `baseURL` in `nuxt.config.ts`:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    edgeonePages: {
      baseURL: 'https://<your-site>.edgeone.app'
    }
  }
})
```

::note
`baseURL` should point to a publicly accessible EdgeOne Pages domain. No trailing slash is needed.
::

## Basic Usage

```vue
<NuxtImg
  provider="edgeonePages"
  src="/path/to/image.png"
  width="600"
  height="400"
  fit="cover"
  :modifiers="{ quality: 80, format: 'webp' }"
/>
```

## Standard Modifiers

All 7 standard NuxtImg modifiers are mapped to imageMogr2:

| Modifier | Mapping | Description |
|---|---|---|
| `width` / `height` | `/thumbnail/<W>x<H>` | Proportional scaling, affected by `fit` |
| `fit` | thumbnail suffix | `contain` → `<W>x<H>`, `cover` → `!<W>x<H>r`, `fill` → `<W>x<H>!` |
| `quality` | `/quality/<Q>` | Quality 1-100 |
| `format` | `/format/<f>` | Output format, `jpeg` is auto-mapped to `jpg` |
| `background` | `/pad/1/color/<base64>` | Used with scaling, fills background color |
| `blur` | `/blur/<n>x<n>` | Gaussian blur |

## Extended Modifiers

Pass EdgeOne Pages-specific image processing parameters via the `:modifiers` prop:

| Modifier | Mapping | Description |
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
  provider="edgeonePages"
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
  provider="edgeonePages"
  src="/photos/portrait.jpg"
  :modifiers="{ crop: '300x300', gravity: 'center' }"
/>
```

Generated URL: `?imageMogr2/crop/300x300/gravity/center`

### Rotate + Sharpen + Strip Metadata

```vue
<NuxtImg
  provider="edgeonePages"
  src="/photos/landscape.jpg"
  :modifiers="{ rotate: 90, sharpen: 70, strip: true }"
/>
```

Generated URL: `?imageMogr2/rotate/90/sharpen/70/strip`

### Gaussian Blur (Placeholder Effect)

```vue
<NuxtImg
  provider="edgeonePages"
  src="/photos/hero.jpg"
  width="100"
  :modifiers="{ blur: 20, quality: 10 }"
/>
```

Generated URL: `?imageMogr2/thumbnail/100x/quality/10/blur/20x20`

### Smart Face Crop

```vue
<NuxtImg
  provider="edgeonePages"
  src="/photos/group.jpg"
  :modifiers="{ scrop: '200x200' }"
/>
```

Generated URL: `?imageMogr2/scrop/200x200`

## References

- [EdgeOne Pages Image Processing](https://edgeone.ai/document/162498)
