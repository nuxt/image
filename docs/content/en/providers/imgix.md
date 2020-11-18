---
title: Imgix Provider
description: ''
position: 13
category: Providers
---

Integration between [imgix](https://docs.imgix.com/) and the image module. To use this provider you just need to specify the base url of your service in imgix.

```js{}[nuxt.config.js]
export default {
  image: {
    providers: {
      imgix: {
        baseURL: 'https://assets.imgix.net'
      }
    }
  }
}
```