---
title: ImageKit Provider
description: "Nuxt Image has first class integration with ImageKit"
navigation:
  title: ImageKit
---

Integration between [ImageKit](https://docs.imagekit.io/) and the image module.

To use this provider you just need to specify the base url of your service in ImageKit (don't forget to add your [ImageKit ID](https://docs.imagekit.io/integration/url-endpoints#default-url-endpoint)).

```js{}[nuxt.config.js]
export default {
  image: {
    imagekit: {
      baseURL: 'https://ik.imagekit.io/your_imagekit_id'
    }
  }
}
```
