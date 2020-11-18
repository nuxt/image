---
title: Usage
description: ''
position: 3
category: Guide
---

## `NuxtImg`

Using image component is just easy as using `<img>` tag. Just define `src`, and your image will be there for you.

<code-group>
  <code-block label="index.vue" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-img src="/nuxt-icon.png" />
  </template>
  ```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-img src="/nuxt-icon.png" />
  </div>

  </code-block>
</code-group>

`<nuxt-img>` is a replacement for `<img>` tag in Nuxt. It will optimize and resize images using its internal optimizer or world-wide images providers.  
 
## `NuxtPicture`

`<nuxt-picture>` is an advanced component designed to optimize and load image on modern web.

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
