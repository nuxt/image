---
title: Caisy
description: Nuxt Image with Caisy integration.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/caisy.ts
    size: xs
---

Integration between [Caisy](https://caisy.io) and the image module.

To use this provider you just need to specify the base URL of your project.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    caisy: {}
  }
})
```

## Modifiers

All the default modifiers from [Caisy's documentation](https://caisy.io/developer/docs/libraries/rendering-images) are available.

```vue
<NuxtImg
  provider="caisy"
  src="https://assets.caisy.io/assets/b76210be-a043-4989-98df-ecaf6c6e68d8/056c27e2-81f5-4cd3-b728-cef181dfe7dc/d83ea6f0-f90a-462c-aebd-b8bc615fdce0pexelsmiguelapadrinan1591056.jpg"
  height="512"
  width="512"
  :quality="90"
/>
```
