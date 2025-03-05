---
title: Prepr
description: Nuxt Image integration with Prepr CMS.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/tree/main/src/runtime/providers/prepr
    size: xs
---

Integration between [Prepr](https://prepr.io) and Nuxt Image.

To use this provider you just need to specify the `projectName` of your project in Prepr.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    prepr: {
      // E.g.: https://YourProjectName.prepr.io
      projectName: 'YourProjectName'
    }
  }
})
```

## Modifiers

The Prepr provider supports a number of additional modifiers. For a full list,
check out the [Prepr documentation](https://docs.prepr.io/reference/rest/v1/assets-resizing).
All current transformations currently mentioned in Prepr docs are supported.

For the time being you might find the following links useful:

- [Assets Resizing via REST API](https://docs.prepr.io/reference/rest/v1/assets-resizing)
- [Understanding your marketing and design team workflows](https://docs.prepr.io/managing-content/images)

::callout
prepr.io does not provide a way to restrict what domains can
request assets to your project's CDN, nor limit the maximum size in `pixels` or
`bytes` of images that are served from the CDN.
::

### Modifiers

The following more readable modifiers are supported, in addition to Prepr's
native modifiers:

- `crop` is equivalent to `c`
- `format` is equivalent to `format`
- `height` is equivalent to `h`
- `quality` is equivalent to `q`
- `width` is equivalent to `w`

### `fit`

In addition to the values specified in the Prepr docs, which are respected, the
following options from the [default `fit` behavior](/usage/nuxt-img#fit)
are supported:

- `cover` - this will behave like the Prepr modifier `crop`, when passed without
a value (defaults to `centre`)

::callout
For the time being, other `fit` options are not supported by this provider.
::
