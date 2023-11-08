---
title: IPX
description: IPX is the built-in and self hosted image optimizer for Nuxt Image.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/ipx.ts
    size: xs
---

Nuxt Image comes with a [preconfigured instance](/get-started/providers#default-provider) of [unjs/ipx](https://github.com/unjs/ipx). An open source, self-hosted image optimizer based on [lovell/sharp](https://github.com/lovell/sharp).

## Additional Modifiers

You can use [additional modifiers](https://github.com/unjs/ipx/#modifiers) supported by IPX.

**Example:**

```html
<NuxtImg src="/image.png" :modifiers="{ grayscale: true, tint: '#00DC82' }" />
```
