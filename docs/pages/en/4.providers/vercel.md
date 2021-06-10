---
title: Vercel Provider
navigation.title: Vercel
description: Optimize images at Vercel's Edge Network
navigation:
  title: Vercel
---

When deploying your nuxt applications to [Vercel](https://vercel.com/) platform, image module can use Vercel's [Edge Network](https://vercel.com/docs/edge-network/overview) to optimize images on demand.

This provider will be enabled by default in vercel deployments.

## Domains

To use external URLs (images not in `static/` directory), hostnames should be whitelisted.

**Example:**

```ts [nuxt.config]
export default {
  image: {
    domains: [
      'avatars0.githubusercontent.com'
    ]
  }
}
```

## Sizes

Specify any custom `width` property you use in `<nuxt-img>`, `<nuxt-picture>` and `$img`.

If a width is not defined, image will fallback to closest possible width.

**Example:**

```ts [nuxt.config]
export default {
  image: {
    screens: {
      icon: 40,
      avatar: 24
    }
  }
}
```
