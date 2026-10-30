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

## Input Formats

The `/_ipx` endpoint decodes images with [sharp](https://github.com/lovell/sharp) (libvips). By default only common web image formats are accepted as input: JPEG, PNG, WebP, GIF, SVG, AVIF and HEIC. A source in any other format is rejected with a `403` before it is decoded.

::warning
To accept additional formats (for example TIFF) from sources you trust, list them with `allowedInputFormats`. The format is the one detected from the source bytes, not the file extension:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    ipx: {
      allowedInputFormats: ['jpeg', 'png', 'webp', 'gif', 'svg', 'avif', 'heic', 'tiff'],
    },
  },
})
```

The same option can be set at runtime through the `NUXT_IPX_ALLOWED_INPUT_FORMATS` environment variable as a comma-separated list.

For sources that are not fully trusted, `restrictDecoders` additionally blocks the decoders of every other format. It is opt-in: it changes process-wide libvips state, so code outside the `/_ipx` endpoint using sharp in the same process will no longer be able to decode the blocked formats either.
::

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
