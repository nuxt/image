---
title: Vercel Provider
navigation.title: Vercel
description: Optimize images at Vercel's Edge Network
navigation:
  title: Vercel
---

When deploying your nuxt applications to [Vercel](https://vercel.com/) platform, image module can use Vercel's [Edge Network](https://vercel.com/docs/edge-network/overview) to optimize images on demand.

Set [`provider`](https://image.nuxtjs.org/api/options#provider) option to `auto` to activate it in production when deploying to Vercel:

```ts [nuxt.config]
export default {
  image: {
    provider: 'auto'
  }
}
```

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