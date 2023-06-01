# Directus

Nuxt Image with Directus integration

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
<nuxt-img
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
<nuxt-img
  provider="directus"
  src="ad514db1-eb90-4523-8183-46781437e7ee"
  :modifiers="{ height: '512', withoutEnlargement: 'true', transforms: [['blur', 4], ['negate']] }"
/>
```

::alert{type="info"}
Directus exposes a `transforms` parameter that accepts a two-dimensional JSON array to communicate directly with the [sharp API](https://sharp.pixelplumbing.com/api-operation). You can easily manage any transforms as a list of lists.
::
