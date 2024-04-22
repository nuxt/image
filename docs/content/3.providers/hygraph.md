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
      baseURL: "",
    },
  },
});
```

## Modifiers

All the default modifiers from [Hygraph's documentation](https://hygraph.com/docs/api-reference/content-api/assets) are available, plus additionally `auto_image` which lets Hygraph decide what image format is best for the user's browser and `quality` 0-100.

```vue
<NuxtImg
  provider="hygraph"
  src="https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/cltsrex89477t08unlckqx9ue"
  height="512"
  width="512"
  fit="max"
  format="jpg"
  :quality="90"
/>
```
