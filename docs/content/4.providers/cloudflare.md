---
title: Cloudflare
description: Nuxt Image has first class integration with Cloudflare
---

Integration between [Cloudflare](https://developers.cloudflare.com/images/) and the image module.

::alert{type="info"}
Availability only for Business and Enterprise Customers. Normally Cloudflare [pages](https://pages.cloudflare.com/) users can already benefit from build-time image optimization.
::

To use this provider you just need to specify the base url (zone) of your service:

```js{}[nuxt.config.js]
export default {
  image: {
    baseURL: 'https://that-test.site'
  }
}
```

**Example:**

```vue
<nuxt-img provider="cloudflare" src="/burger.jpeg" height="300" :modifiers="{ fit: 'contain' }" />
```

## Options

### `baseURL`

Default: `/`

Your deployment's domain (zone).

**Note:** `/cdn-cgi/image/` will be automatically appended for generating URLs.
