---
title: Prismic
description: Nuxt Image has first class integration with Prismic.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/prismic.ts
    size: xs
---

Integration between [Prismic](https://prismic.io/docs) and the image module.

No specific configuration is required for Prismic support. You just need to specify `provider: 'prismic'` in your configuration to make it the default:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    prismic: {}
  }
})
```

You can also pass it directly to your component when you need it, for example:

```vue
<NuxtImg provider="prismic" src="..." />
```

::callout
Prismic allows content writer to manipulate images through its UI (cropping, rezising, etc.). To preserve that behavior this provider does not strip query parameters coming from Prismic. Instead it only overrides them when needed, keeping developers in control.
::
