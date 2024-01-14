---
title: Bunny
description: Nuxt Image with Bunny integration.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/bunny.ts
    size: xs
---

Integration between [Bunny](https://bunny.net/) and the image module.

To use this provider you just need to specify the base URL of your project.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    bunny: {
      baseURL: "https://<your-hostname>.b-cdn.net",
    },
  },
});
```

## Modifiers

All the default modifiers from [Bunny's documentation](https://docs.bunny.net/docs/stream-image-processing) are available.

```vue
<NuxtImg
  provider="bunny"
  src="https://bunnyoptimizerdemo.b-cdn.net/bunny1.jpg"
  height="512"
  width="512"
  :quality="90"
/>
```
