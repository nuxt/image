---
title: Directus
description: Nuxt Image with Directus integration.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/directus.ts
    size: xs
---

Integration between [Directus](https://directus.io/) and the image module.

To use this provider you just need to specify the base URL of your project.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    directus: {
      // This URL needs to include the final `assets/` directory
      baseURL: 'http://localhost:8055/assets/',
    }
  }
})
```

You can easily override default options:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    directus: {
      baseURL: 'http://mydirectus-domain.com/assets/',
      modifiers: {
        withoutEnlargement: 'true',
        transforms: [['blur', 4], ['negate']]
      }
    }
  }
})
```

## Modifiers
All the default modifiers from [Directus documentation](https://docs.directus.io/reference/files.html#requesting-a-thumbnail) are available.

```vue
<NuxtImg
  provider="directus"
  src="ad514db1-eb90-4523-8183-46781437e7ee"
  height="512"
  fit="inside"
  quality="20"
  :modifiers="{ withoutEnlargement: 'true' }"
/>
```

Since Directus exposes [the full sharp API](https://sharp.pixelplumbing.com/api-operation) through the `transforms` parameter, we can use it inside our `modifiers` prop:

```vue
<NuxtImg
  provider="directus"
  src="ad514db1-eb90-4523-8183-46781437e7ee"
  :modifiers="{ height: '512', withoutEnlargement: 'true', transforms: [['blur', 4], ['negate']] }"
/>
```

::callout
Note that the `transforms` parameter, as stated in the [Directus documentation](https://docs.directus.io/reference/files.html#advanced-transformations), is basically a list of lists. This is to facilitate the use of those sharp functions, like [`normalise`](https://sharp.pixelplumbing.com/api-operation#normalise), that would need multiple values in input: `transforms: [['normalise', 1, 99], ['blur', 4], ['negate']]`.
::
