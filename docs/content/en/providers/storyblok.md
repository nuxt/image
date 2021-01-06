---
title: Storyblok Provider
description: ''
position: 13
category: Providers
---

Integration between [Storyblok](https://www.storyblok.com/docs/image-service/) and the image module. To use this provider you just need to specify the base url of your service in Storyblok.

```js{}[nuxt.config.js]
export default {
  image: {
    storyblok: {
      baseURL: 'https://img2.storyblok.com'
    }
  }
}
```