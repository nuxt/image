# Directus

Nuxt Image with Directus integration

Integration between [Directus](https://directus.io/) and the image module.

No specific configuration is required. You just need to specify `directus` in your configuration to make it the default provider:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    directus: {}
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
        transforms: '[["blur", 4], ["negate"]]'
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
  :modifiers="{ withoutEnlargement: 'true', transforms: '[[&quot;blur&quot;, 4], [&quot;negate&quot;]]' }"
/>
```

::alert{type="info"}
The `transforms` parameter accepts a two-dimensional JSON array. This means that we should either pass an object to our `modifiers` prop or use `&quot;` to wrap around our parameters in the third quotation layer.
::