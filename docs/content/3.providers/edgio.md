---
title: Edgio
description: Optimize images with Edgio (formerly Layer0)'s optimization service.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/edgio.ts
    size: xs
---

Edgio provides a simple HTTP service for optimizing images.

::callout
The image optimizer will only return an optimized image for mobile browsers. Desktop browsers are served the original image.
::

This integration works out of the box without need to configure!  See the [Documentation](https://docs.edg.io/guides/image_optimization) for more information.

**Example:**

```vue
<NuxtImg provider="edgio" src="https://i.imgur.com/LFtQeX2.jpeg" width="200" height="200" quality="80" />
```

## Modifiers

Edgio supports the following modifiers: `height`, `width` and `quality`

## Options

### `baseURL`

- Default: `https://opt.moovweb.net`
