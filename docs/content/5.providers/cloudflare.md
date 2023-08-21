# Cloudflare

Nuxt Image has first class integration with Cloudflare

Integration between [Cloudflare](https://developers.cloudflare.com/images/) and the image module.

To use this provider you just need to specify the base url (zone) of your service:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudflare: {
      baseURL: 'https://that-test.site'
    }
  }
})
```

**Example:**

```vue
<NuxtImg provider="cloudflare" src="/burger.jpeg" height="300" :modifiers="{ fit: 'contain' }" />
```

## Options

### `baseURL`

Default: `/`

Your deployment's domain (zone).

**Note:** `/cdn-cgi/image/` will be automatically appended for generating URLs.
