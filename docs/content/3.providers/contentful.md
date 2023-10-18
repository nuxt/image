---
title: Contentful
description: Nuxt Image has first class integration with Contentful.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/contentful.ts
    size: xs
---

Integration between [Contentful](https://www.contentful.com/) and the image module.

To use this provider you just need to specify the base url of your service in Contentful.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    contentful: {}
  }
})
```
