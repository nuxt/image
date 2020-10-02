---
title: Usage
description: ''
position: 3
category: Guide
---

## Basic

Using image component is just easy as using `<img>` tag. Just define `src`, `width` and `height` and your image will be there for you.

<code-group>
  <code-block label="index.vue" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-image src="/nuxt-icon.png" width="50px" height="50px" />
  </template>
  ```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-image src="/nuxt-icon.png" width="50px" height="50px" />
  </div>

  </code-block>
</code-group>

Defining `width` and `height` is required, without fixed size your page will face [layout shifting](https://web.dev/cls/) that is bad for user experience. Don't worry there is a [legacy](/nuxt-image#legacy) prop to ignore this requirement.  