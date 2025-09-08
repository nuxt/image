---
title: Cloudimage
description: Nuxt Image has first class integration with Cloudimage.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/cloudimage.ts
    size: xs
---

Integration between [Cloudimage](https://www.cloudimage.io/en/home) and the image module.

To use this provider you need to specify either your Cloudimage `token` (with optional `apiVersion`) or a full `cdnURL`. The `baseURL` of your image storage is optional and is only used when the passed `src` is not an absolute URL.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudimage: {
      token: 'your_cloudimage_token',
      baseURL: 'origin_image_url' // or alias (optional)
    }
  }
})
```

## Options

### `token`

- Type: **String** (required)

Your Cloudimage customer token. [Register](https://www.cloudimage.io/en/register_page) for a Cloudimage account to get one. Registration takes less than a minute and is totally free.

### `baseURL`

- Type: **String** (optional)

Your origin image URL or storage alias that allows to shorten your origin image URLs. If not provided, the `src` will be joined directly with the computed `cdnURL`.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudimage: {
      token: 'demo',
      baseURL: 'sample.li'
    }
  }
})
```

These formats all work as well:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudimage: {
      token: 'demo',
      baseURL: 'sample.li/images',
      baseURL: 'https://sample.li/images',
      baseURL: '_sl_' // alias defined in your Cloudimage storage settings
    }
  }
})
```

### `apiVersion`

- Type: **String**
- Default: `empty string`

Allow using a specific version of the API.

::note
For tokens created before **20.10.2021**, `apiVersion` needs to be set to `v7`.
::

Here's an official demo config. `demo` is an old token hence `apiVersion` needs to be defined as well.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudimage: {
      token: 'demo',
      baseURL: 'sample.li',
      apiVersion: 'v7'
    }
  }
})
```

### `cdnURL`

- Type: **String**
- Default: `https://{token}.cloudimg.io/{apiVersion}`

Replaces the dynamically built URL. Useful when you prefer not to provide a `token` or need a custom CDN hostname.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudimage: {
      cdnURL: 'https://demo.cloudimg.io/v7'
    }
  }
})
```

When only `cdnURL` is provided and `baseURL` is omitted, relative sources are resolved directly against the CDN URL, for example `src: '/test.png'` becomes `https://demo.cloudimg.io/v7/test.png`.

## Cloudimage Modifiers

Beside the [standard modifiers](/usage/nuxt-img#modifiers), also you can pass Cloudimage-specific [Cloudimage-specific transformation](https://docs.cloudimage.io/go/cloudimage-documentation-v7/en/introduction) params to `modifiers` prop.

## Cloudimage `fit` Values

Beside the [standard values for `fit` property](/usage/nuxt-img#fit) of Nuxt image and Nuxt picture, Cloudimage offers the following for extra resizing params:

- `crop` - Crops the image to specified dimensions (width and height) and keeps proportions.
- `face` - Crops the image automatically keeping the most prominent face.
- `fit` - Resizes the image to fit into a specified width and height box, adds padding (image or solid color) to keep proportions.
- `cropfit` - Sets crop or fit resize mode depending on the origin and the desired dimensions.
- `bound` - Resizes to a given width and height box and keeps proportions. Similar to fit but without adding padding.
- `boundmin` - Resizes an image while bounding the smaller dimension to the desired width or height while keeping proportions.
