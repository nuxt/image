---
title: Picture Component
description: "Picture component"
position: 8
category: Components
---

If you want to use modern and optimized formats like `webp` or `avif` and support browsers like `IE` or `Safari` you should use `nuxt-picture` component. `nuxt-picture` component is based on HTML `<picture>` tag, this component is designed to support modern formats and improve browser compatibility at the same time.

`nuxt-picture` supports all available props of `nuxt-img` with these additional props:

## `lazy`

By default `nuxt-picture` lazy load all images to reduce initial requests and page size. Using `lazy` prop you can disable lazy loading.

<code-group>
  <code-block label="index.vue" active>

```vue{}[index.vue]
<template>
  <nuxt-img
    :lazy="false"
    provider="cloudinary"
    preset="jpg-cover"
    src="/remote/nuxt-org/blog/going-full-static/main.png"
    width="300"
    height="169"
  />
</template>
```

  </code-block>
  <code-block label="nuxt.config.js">

```js{}[nuxt.config.js]
export default {
  image: {
    presets: [
      {
        name: "jpg-cover",
        modifiers: {
          fit: "cover",
          format: "jpg",
          width: 300,
          height: 300,
        },
      },
    ],
    cloudinary: {
      baseURL: "https://res.cloudinary.com/nuxt/image/upload/",
    },
  },
};
```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-img lazy="false" provider="cloudinary" preset="jpg-cover" src="/remote/nuxt-org/blog/going-full-static/main.png" />
  </div>

  </code-block>
</code-group>

## `placeholder`

The placeholder is a small, low quality image that will show while the original image is loading. You could provide your own placeholder or let `nuxt-img` generate it for you.  
If you set `placeholder` to `true`, module creates a small placeholder for you. You can set your custom placeholder in this prop.

<code-group>
  <code-block label="Auto Generate" active>

```vue{}[index.vue]
<template>
  <nuxt-img placeholder src="/nuxt-icon.png" />
</template>
```

  </code-block>
  <code-block label="Custom Placeholder">

```vue{}[index.vue]
<template>
  <nuxt-img placeholder="/icon.png" src="/nuxt-icon.png" />
</template>
```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-img placeholder="/icon.png" src="/nuxt-icon.png"></nuxt-img>
  </div>

  </code-block>
</code-group>

## `fallbackFormat`

When using modern formats like `webp`, you may need to create a fallback image with different file format to support older browsers.

## `no-script`

Genererate `<noscript>` tag for browsers that aren’t running javascript.
