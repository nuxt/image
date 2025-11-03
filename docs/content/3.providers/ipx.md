---
title: IPX
description: IPX is the built-in and self hosted image optimizer for Nuxt Image.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/ipx.ts
    size: xs
---

Nuxt Image comes with a [preconfigured instance](/get-started/providers#default-provider) of [unjs/ipx](https://github.com/unjs/ipx) - an open source, self-hosted image optimizer based on [lovell/sharp](https://github.com/lovell/sharp).

## Additional Modifiers

You can use [additional modifiers](https://github.com/unjs/ipx/#modifiers) supported by IPX.

**Example:**

```vue
<NuxtImg
  src="/image.png"
  :modifiers="{ grayscale: true, tint: '#00DC82' }"
/>
```

## Runtime Configuration

You can update the options for `ipx` at runtime by passing the appropriate environment variable. For example:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  runtimeConfig: {
    ipx: {
      baseURL: process.env.NUXT_IPX_BASE_URL || '/_ipx',
      alias: {
        someAlias: process.env.NUXT_IPX_ALIAS_SOME_ALIAS || ''
      },
      http: {
        domains: process.env.NUXT_IPX_HTTP_DOMAINS,
      },
    },
  },
})
```
