---
title: Hygraph
description: Nuxt Image with Hygraph integration.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/hygraph.ts
    size: xs
---

Integration between [Hygraph](https://hygraph.com/) and the image module.

To use this provider you just need to specify the base URL of your project.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    hygraph: {
      // If not filled out, the provider will add this as a default.
      baseURL: "https://media.graphassets.com",
    },
  },
});
```

## Modifiers

All the default modifiers from [Hygraph's documentation](https://hygraph.com/docs/api-reference/content-api/assets) are available, plus additionally `auto_image` which lets Hygraph decide what image format is best for the user's browser and `quality` 0-100.

```vue
<NuxtImg
  provider="hygraph"
  src="https://media.graphassets.com/JL6e2yJERUyQtTiZIzPb"
  height="512"
  width="512"
  fit="max"
  format="jpg"
  :quality="90"
/>
```
