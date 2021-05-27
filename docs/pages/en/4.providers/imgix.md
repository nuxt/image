---
title: Imgix Provider
description: 'Nuxt Image has first class integration with Imgix'
navigation:
  title: Imgix
---

Integration between [Imgix](https://docs.imgix.com/) and the image module.

To use this provider you just need to specify the base url of your service in Imgix.

```js{}[nuxt.config.js]
export default {
  image: {
    imgix: {
      baseURL: 'https://assets.imgix.net'
    }
  }
}
```
