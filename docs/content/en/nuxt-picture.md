---
title: Picture Component
description: "Picture component"
position: 8
category: Components
---

If you want to use modern and optimized formats like `webp` or `avif` and support browsers like `IE` or `Safari` you should use `nuxt-picture` component. `nuxt-picture` component is based on HTML `<picture>` tag, this component is designed to support modern formats and improve browser compatibility at the same time.

<alert type="info">

`<nuxt-picture>` supports all available props of [`<nuxt-img>`](/nuxt-img) with these additional props.

</alert>

## `loading`

- Type: `Boolean` or `String`
  - Default: `true`
  - String values: `'eager'` or `'lazy'`, [learn more](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading)

By default, `<nuxt-picture>` lazy load the image to reduce initial requests and page size.

Correspondance of boolean / string values:

| Boolean | String |
| --------|--------|
| `true`  | `'lazy'` |
| `false` | `'eager'` |

To disable lazy loading, add `loading="eager"` or `:loading="false"` prop:

```html{}[index.vue]
<nuxt-picture src="/main.png" :loading="false" width="400" height="300" />
```
## `placeholder`

- Type: `Boolean` or `String`
  - Default: `false`
  - String value: source of the image

The placeholder is a small, low quality image that will show while the original image is loading.

You can provide your own placeholder or let `<nuxt-picture>` generates it for you.

If you add the `placeholder` prop, Nuxt image will create the placeholder image:

<code-group>
  <code-block label="Auto" active>

```html
<template>
  <nuxt-picture placeholder src="https://images.unsplash.com/photo-1606661247834-eb1f16814366?w=1950&q=80" />
</template>
```

  </code-block>

  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-picture placeholder src="https://images.unsplash.com/photo-1606661247834-eb1f16814366?w=1950&q=80" height="300" format="jpg"></nuxt-picture>
  </div>

  </code-block>
</code-group>

You can set a custom placeholder by using a source in the `placeholder` prop:

<code-group>
  <code-block label="Custom" active>

```html
<template>
  <nuxt-picture placeholder="https://images.unsplash.com/photo-1606661247834-eb1f16814366?w=20&q=80" src="https://images.unsplash.com/photo-1606661247834-eb1f16814366?w=1950&q=80" />
</template>
```

  </code-block>

  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-picture placeholder="https://images.unsplash.com/photo-1606661247834-eb1f16814366?w=20&q=80" src="https://images.unsplash.com/photo-1606661247834-eb1f16814366?w=1950&q=80" height="300"></nuxt-picture>
  </div>

  </code-block>
</code-group>

## `fallbackFormat`

When using modern formats like `webp`, you may need to create a fallback image with different file format to support older browsers.

## `no-script`

Genererate `<noscript>` tag for browsers that aren’t running javascript.
