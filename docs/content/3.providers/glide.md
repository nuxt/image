---
title: Glide
description: Nuxt Image has first class integration with Glide.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/glide.ts
    size: xs
---

Integration between [Glide](https://glide.thephpleague.com/) and the image module.

To use this provider you just need to specify the base url of your service in glide.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    glide: {
      // baseURL of your laravel application
      baseURL: 'https://glide.herokuapp.com/1.0/'
    }
  }
})
```
