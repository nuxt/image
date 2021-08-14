---
title: Imgproxy Provider
description: 'Nuxt Image has first class integration with Imgproxy'
navigation:
  title: Imgproxy
---

Integration between [Imgproxy](https://imgproxy.net/) and the image module.

To use this provider you just need to specify the base url of your service in Imgproxy.

```js{}[nuxt.config.js]
export default {
  image: {
    imgix: {
      baseURL: 'http://imgproxy.example.com',
      key: 'xxxxxxxxxxxxxx',
      salt: 'xxxxxxxxxxxxxx'
    }
  }
}
```
