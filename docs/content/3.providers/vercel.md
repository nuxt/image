---
title: Vercel
description: Optimize images at Vercel's Edge Network.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/vercel.ts
    size: xs
---

When deploying your nuxt applications to [Vercel](https://vercel.com/) platform, image module can use Vercel's [Edge Network](https://vercel.com/docs/edge-network/overview) to optimize images on demand.

This provider will be enabled by default in vercel deployments.

::callout{icon="i-heroicons-exclamation-triangle" color="amber"}
Vercel requires you to explicitly list all the widths used in your app. [See example below.](#sizes)
::

## Domains

To use external URLs (images not in `public/` directory), hostnames should be whitelisted.

**Example:**

```ts [nuxt.config]
export default {
  image: {
    domains: [
      'avatars0.githubusercontent.com'
    ]
  }
}
```

## Sizes

You need to specify **every custom width** used in `<NuxtImg>`, `<NuxtPicture>` or `$img` for vercel to resize them properly. [Source.](https://vercel.com/docs/build-output-api/v3/configuration#api)

If a width is not defined, image will fallback to the next bigger width.

::callout{icon="i-heroicons-light-bulb"}
Don't forget to also take into account [`densities`](/get-started/configuration#densities).
::

**Example:**

::code-group

  ```html [index.vue]
  <template>
    <NuxtImg height="40" width="40" preset="cover" src="/nuxt-icon.png" />
  </template>
  ```

  ```ts [nuxt.config]
  export default {
    image: {
      screens: {
        icon: 40,
        icon2x: 80
      }
    }
  }
  ```

::
