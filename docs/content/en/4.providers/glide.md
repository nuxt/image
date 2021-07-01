---
title: Glide Provider
description: 'Nuxt Image has first class integration with Glide'
navigation:
  title: glide
---

Integration between [glide](https://glide.thephpleague.com/) and the image module.

To use this provider you just need to specify the base url of your service in glide.

```js{}[nuxt.config.js]
export default {
  image: {
    glide: {
      baseURL: 'https://glide.example.com'
    }
  }
}
```
