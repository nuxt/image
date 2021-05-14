---
menuTitle: Prismic
title: Prismic Provider
description: 'Nuxt Image has first class integration with Prismic'
category: Providers
---

Integration between [Prismic](https://prismic.io/docs) and the image module.

To use this provider you just need to specify an empty object at `prismic` key in Nuxt Image options object.

```js{}[nuxt.config.js]
export default {
  image: {
    prismic: {}
  }
}
```

<alert type="info">

Prismic allows content writer to manipulate images through its UI (cropping, rezising, etc.). To preserve that behavior this provider does not strip query parameters coming from Prismic. Instead it only overrides them when needed, keeping developers in control.

</alert>