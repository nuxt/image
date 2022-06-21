---
title: Layer0 Provider
description: Optimize images with Layer0's optimization service
navigation:
  title: Layer0
---

Layer0 provides a simple HTTP service for optimizing images. See the [Documentation](https://docs.layer0.co/guides/image_optimization) for more information.

**Note:** The image optimizer will only return an optimized image for mobile browsers. Desktop browsers are served the original image.

This integration works out of the box without need to configure!

## Modifiers

Layer0 supports the following modifiers: `height`, `width` and `quality`

**Example:**

```vue
<nuxt-img provider="layer0" src="https://i.imgur.com/LFtQeX2.jpeg" width="200" height="200" quality="80" />
```
