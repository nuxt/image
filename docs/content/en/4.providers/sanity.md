---
menuTitle: Sanity
title: Sanity Provider
description: 'Nuxt Image has first class integration with Sanity'
category: Providers
---

Integration between [Sanity](https://www.sanity.io/docs/image-urls) and the image module.

To use this provider you just need to specify the `projectId` of your project in Sanity.

```js{}[nuxt.config.js]
export default {
  image: {
    sanity: {
      projectId: 'yourprojectid',
      // Defaults to 'production'
      // dataset: 'development'
    }
  }
}
```
