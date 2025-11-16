---
title: Supabase
description: Nuxt Image with Supabase Storage integration.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/supabase.ts
    size: xs
---

Integration between [Supabase Storage](https://supabase.com/docs/guides/storage) and the image module.

Supabase Storage provides image transformations powered by imgproxy. This provider enables optimization and resizing of images stored in your Supabase public buckets.

## Requirements

- Supabase Pro tier or above (image transformations not available on free tier)
- Public storage bucket (authenticated images not currently supported)

## Configuration

To use this provider you need to specify the base URL pointing to your Supabase project's storage render endpoint.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    supabase: {
      baseURL: 'https://<project-id>.supabase.co/storage/v1/render/image/public/<bucket-name>'
    }
  }
})
```

::note
Replace `<project-id>` with your Supabase project ID and `<bucket-name>` with your public bucket name.
::

## Usage

```vue
<NuxtImg
  provider="supabase"
  src="/path/to/image.jpg"
  width="300"
  height="200"
/>
```

## Modifiers

Supabase supports the following modifiers based on [Supabase's image transformation API](https://supabase.com/docs/guides/storage/serving/image-transformations):

### `width`

- **Type:** `Number`
- **Range:** 1-2500
- **Description:** Target width in pixels

### `height`

- **Type:** `Number`
- **Range:** 1-2500
- **Description:** Target height in pixels

::note
Supabase recommends specifying only `width` or `height` (not both) to maintain aspect ratio. When both are provided, the image will be resized and cropped according to the `resize` mode.
::

### `quality`

- **Type:** `Number`
- **Range:** 20-100
- **Default:** 80
- **Description:** Quality/compression level

### `resize`

- **Type:** `String`
- **Values:** `cover`, `contain`, `fill`
- **Default:** `cover`
- **Description:** Resize mode
  - `cover`: Fills specified dimensions while maintaining aspect ratio, crops excess
  - `contain`: Fits within dimensions while maintaining aspect ratio
  - `fill`: Resizes without aspect ratio preservation

### `format`

- **Type:** `String`
- **Values:** `origin` or specific format
- **Description:** Output format. Use `origin` to keep the original format, otherwise images are automatically converted to WebP

## Example

```vue
<NuxtImg
  provider="supabase"
  src="/photos/landscape.jpg"
  width="800"
  height="600"
  :modifiers="{ quality: 85, resize: 'cover' }"
/>
```

## Limitations

- Only works with public buckets using `getPublicUrl()`
- Authenticated images (signed URLs) are not currently supported
- Maximum image size: 25MB
- Maximum resolution: 50MP
- Requires Supabase Pro tier or above

## Learn More

- [Supabase Storage Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
