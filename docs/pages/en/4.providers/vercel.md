---
title: Vercel Provider
navigation.title: Vercel
description: Optimize images at Vercel's Edge Network
navigation:
  title: Vercel
---

When deploying your nuxt applications to [Vercel](https://vercel.com/) platform, image module can use Vercel's [Edge Network](https://vercel.com/docs/edge-network/overview) to optimize images on demand.

Default provider will be auto detected upon deployment. You should keep `provier` option to be `auto` for vercel support.

## Sizes

We need to specify any custom `width` property we use in `<nuxt-img>`, `<nuxt-picture>` and `$img`

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

## Domains

If using external URLs, hostnames should be whitelisted:

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
