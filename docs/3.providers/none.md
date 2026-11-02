---
title: None
description: A pass-through provider that returns images without any transformations.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/none.ts
    size: xs
---

The `none` provider is a minimal pass-through provider that returns image URLs without applying any transformations or optimizations.

This provider is useful when you want to use Nuxt Image components for consistent markup and loading behavior, but don't need actual image optimization.

## Usage

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    provider: 'none'
  }
})
```

## Behavior

When using the `none` provider:
- No image transformations are applied (resizing, format conversion, etc.)
- Modifiers are ignored
- The original image URL is returned as-is
- All Nuxt Image component features like lazy loading and placeholders still work

This is particularly useful for development, testing, or when your images are already optimized and you just want the component interface.

