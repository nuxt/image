---
title: <nuxt-picture>
description: "Picture component"
category: Components
position: 202
---

## `<nuxt-picture>`

`<nuxt-picture>` is an advanced component designed to optimize and load image on modern web.

- Loading Placeholder
- Serve modern format `webp` when browser supports it
- Generates responsive srcSet

If you want to use modern and optimized formats like `webp` or `avif` and support browsers like `IE` or `Safari` you should use `nuxt-picture` component. `nuxt-picture` component is based on HTML `<picture>` tag, this component is designed to support modern formats and improve browser compatibility at the same time.

<code-group>
  <code-block label="index.vue" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-picture src="/nuxt-icon.png" placeholder />
  </template>
  ```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-picture src="/nuxt-icon.png" placeholder />
  </div>

  </code-block>
</code-group>

When you use `<nuxt-picture>`, It automatically calculates aspect ratio of the image and set size of the image based on the aspect ratio. The image's width will be equal to width of parent element in DOM and its height calculates based on the aspect ratio.
Forcing images to preserve aspect ratio will prevent [layout shifting](https://web.dev/cls/).
If you want to resize the image all you need is changing the width using CSS.

Don't worry you can control the aspect ratio of the image using `width` and `height` props. If you provide both `width` and `height`, the aspect ratio will be calculated using the `width` and `height`.

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
