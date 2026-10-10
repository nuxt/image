---
title: TruoCloud
description: Nuxt Image has first class integration with TruoCloud.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/truocloud.ts
    size: xs
---

Integration between [TruoCloud](https://docs.truo.cloud/images) and the image module.

To use this provider, set `baseURL` to the delivery endpoint shown in your
console under **Images → Endpoint**. It ends in your tenant's public id, which
is not a secret: it appears in every image URL on your site.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    truocloud: {
      baseURL: 'https://img.truo.cloud/i/<pid>'
    }
  }
})
```

## TruoCloud `fit` Values

TruoCloud supports all the [standard values for the `fit` property](/usage/nuxt-img#fit) of Nuxt image and Nuxt picture, and also accepts the imgix and
ImageKit vocabularies (`crop`, `clip`, `pad`, `scale`…), which it maps itself.

One difference worth knowing if you are migrating: `fit=fill` **stretches** the
image, following sharp's semantics rather than imgix's letterbox. Use
`fit=contain` for padding.

## TruoCloud Modifiers

Beside the [standard modifiers](/usage/nuxt-img#modifiers), you can pass any
TruoCloud parameter through the `modifiers` prop — gravity, crops, blur,
filters and the rest. The full list is in the [TruoCloud image
documentation](https://docs.truo.cloud/images).

## Choosing an output format

`format: 'auto'` picks avif or webp from the browser's `Accept` header and
answers `Vary: Accept`. That is correct HTTP, and it is also the fragile part:
`Accept` has very high cardinality, and some CDNs ignore `Vary` on images
unless you turn it on explicitly.

If your images sit behind a third-party CDN you did not configure, pin
`format: 'webp'` instead. A slightly larger file that is always the right one
beats an avif served to a browser that cannot decode it.

```vue
<NuxtImg
  provider="truocloud"
  src="/photos/sea.jpg"
  width="300"
  height="500"
  fit="cover"
  :modifiers="{ format: 'auto', gravity: 'attention' }"
/>
```

That returns a 300 x 500 image, cropped towards the most interesting region of
the picture rather than its centre, in the best format the browser accepts.

## Sizing the ladder

TruoCloud caches a transformation on its second identical request, so every
extra width in a responsive ladder costs two transformations before it starts
being served from cache. Five breakpoints cover the real range; the default
`screens` are worth trimming if you are on a free tier.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    screens: { xs: 640, sm: 828, md: 1200, lg: 1600, xl: 2048 }
  }
})
```
