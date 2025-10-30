---
title: Filerobot
description: Nuxt Image with Filerobot integration.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/filerobot.ts
    size: xs
---

Integration between Scaleflex [Filerobot](https://www.scaleflex.com/digital-asset-management-filerobot) and the image module.

To use this provider you just need to specify the base URL of your project.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    filerobot: {
      baseURL: 'https://<slug>.filerobot.com/',
    },
  }
})
```
