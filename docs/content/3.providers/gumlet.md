---
title: Gumlet
description: Nuxt Image has first class integration with Gumlet.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/gumlet.ts
    size: xs
---

Integration between [Gumlet](https://docs.gumlet.com) and the image module.

To use this provider you just need to specify the base URL of your service in Gumlet.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    gumlet: {
      baseURL: 'https://demo.gumlet.io'
    }
  }
})
```

## Gumlet `mode` Values

Gumlet supports all the [standard values for `fit` property](/usage/nuxt-img#fit) of Nuxt image and Nuxt picture.

## Gumlet Modifiers

Beside the [standard modifiers](/usage/nuxt-img#modifiers), you can also pass all gumlet-specific render API parameters to the `modifiers` prop.

For a full list of these modifiers and their uses, check out [Gumlet's image transform API documentation](https://docs.gumlet.com/reference/image-transform-size#mode).

## Gumlet Best Practices

Some common best practices when using Gumlet, would be to include our `format=auto` parameter, which will automatically apply the best format for an image and compress the image as well. Combine this with some top of intelligent cropping and resizing and you will have a great image!

```vue
<NuxtImg
  provider="gumlet"
  src="/sea.jpeg"
  width="300"
  height="500"
  fit="cover"
  :modifiers="{ format: 'auto', compress: 'true' }"
/>
```

This will return a 300 x 500 image, which has been compressed, will display next-gen formats for a browser, and has been cropped intelligently to the face of the [woman in the hat](https://demo.gumlet.io/sea.jpeg?format=auto\&w=300\&h=500\&compress=true).
