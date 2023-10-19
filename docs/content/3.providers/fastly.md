---
title: Fastly
description: Nuxt Image has first class integration with Fastly.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/fastly.ts
    size: xs
---

Integration between [Fastly](https://docs.fastly.com/en/guides/image-optimization-api) and the image module.

To use this provider you just need to specify the base url of your service in Fastly.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    fastly: {
      baseURL: 'https://www.fastly.io'
    }
  }
})
```
