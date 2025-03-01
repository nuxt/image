---
title: Cloudflare
description: Nuxt Image has first class integration with Cloudflare.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/cloudflare.ts
    size: xs
---

Integration between [Cloudflare](https://developers.cloudflare.com/images) and the image module.

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Before using this provider, make sure to enable **Image Transformations** for your domain in the Cloudflare dashboard at `Images > Transformations`. If you plan to use images from external domains, also enable 'Resize Image from Any Origin'.
::

To use this provider you just need to specify the base URL (zone) of your service:

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
<NuxtImg
  provider="cloudflare"
  src="/burger.jpeg"
  height="300"
  :modifiers="{ fit: 'contain' }"
/>
```

## Options

### `baseURL`

Default: `/`

Your deployment's domain (zone).

**Note:** `/cdn-cgi/image/` will be automatically appended for generating URLs.
