---
title: Picsum
description: Nuxt Image with Lorem Picsum placeholder images.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/picsum.ts
    size: xs
---

Integration between [Lorem Picsum](https://picsum.photos/) and the image module.

Lorem Picsum provides random placeholder images. It is useful during development or for demo purposes.

To use this provider you just need to enable it in your Nuxt config:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    picsum: {}
  }
})
```

## Usage

### Random image

Get a random image with specific dimensions:

```vue
<NuxtImg
  provider="picsum"
  src="/"
  width="200"
  height="300"
/>
```

### Specific image by ID

Use `id/{id}` as the `src` to get a specific image:

```vue
<NuxtImg
  provider="picsum"
  src="id/237"
  width="200"
  height="300"
/>
```

### Seeded random image

Use `seed/{seed}` as the `src` to get a consistent random image based on a seed string:

```vue
<NuxtImg
  provider="picsum"
  src="seed/picsum"
  width="200"
  height="300"
/>
```

## Modifiers

### `grayscale`

Return the image in grayscale.

```vue
<NuxtImg
  provider="picsum"
  src="id/870"
  width="300"
  height="200"
  :modifiers="{ grayscale: true }"
/>
```

### `blur`

Apply a blur effect to the image. Accepts values from 1 to 10.

```vue
<NuxtImg
  provider="picsum"
  src="id/1025"
  width="250"
  height="250"
  :modifiers="{ blur: 5 }"
/>
```

::note
The `src` value must be either `id/{id}` for a specific image, `seed/{seed}` for a seeded random image, or `/` for a fully random image. Other `src` values are ignored and a random image will be returned.
::

::note
Picsum does not support height-only resizing. When only `height` is provided without `width`, a square image of that dimension will be returned.
::
