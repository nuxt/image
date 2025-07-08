---
title: Shopify
description: Nuxt Image integration with Shopify CDN.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/shopify.ts
    size: xs
---

Integration between [Shopify CDN](https://cdn.shopify.com/) and Nuxt Image.

To use this provider, you just need to pass the image URL from the Storefront API response to the `src` prop.

Configure the provider in your `nuxt.config.ts` (optional):

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    shopify: {
      baseURL: 'https://cdn.shopify.com/',
    }
  }
})
```

## Modifiers

The Shopify CDN provider supports the following default modifiers:

- `width`
- `height`
- `format`
- `quality`

Additionally, the following modifiers are supported:

- `padColor`
- `crop`
- `cropLeft`
- `cropTop`
- `cropWidth`
- `cropHeight`

### Format

The `format` modifier is supported.

```vue
<NuxtImg src="..." width="300" height="300" modifiers="{ format: 'gif' }" />
```

### Quality

The `quality` modifier is supported.

```vue
<NuxtImg src="..." width="300" height="300" modifiers="{ quality: 10 }" />
```

### Crop

The `crop` modifier is supported with the following values:

- `center`
- `top`
- `bottom`
- `left`
- `right`
- `region`

```vue
<NuxtImg src="..." width="300" height="300" modifiers="{ crop: 'center' }" />
```

#### Crop Region

The `crop` modifier can also be used to crop an image to a specific region.

```vue
<NuxtImg
  src="..." 
  width="300" 
  height="300" 
  modifiers="{ 
    crop: 'region', 
    cropLeft: 100, 
    cropTop: 100, 
    cropWidth: 450, 
    cropHeight: 300
  }"
/>
```

### Pad color

The `padColor` modifier can be used to pad an image with a background color. Must be a hex color value.

```vue
<NuxtImg src="..." width="300" height="300" modifiers="{ padColor: 'ff0000' }" />
```
