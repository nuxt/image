---
title: Directus
description: Nuxt Image has first class integration with Directus
---

Integration between [Directus](https://docs.directus.io/reference/files/#requesting-a-thumbnail) and the image module.

To use this provider you need to specify the base url of your service in Directus.

```js{}[nuxt.config.js]
export default {
  image: {
    directus: {
      // baseURL of your Directus application
      baseURL: 'https://demo.directus.io'
    }
  }
}
```
