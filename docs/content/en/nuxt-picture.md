---
title: Picture Component
description: 'Picture component'
position: 8
category: Componets
---

If you want to use modern and optimized formats like `webp` or `avif` and support browsers like `IE` or `Safari` you should use `nuxt-picture` component. `nuxt-picture` component is based on HTML `<picture>` tag, this component is designed to support modern formats and improve browser compatibility at the same time.

The usage of `nuxt-picture` is same as `nuxt-image`, with a little differences:

- When you use modern formats like `webp` in the component, a fallback image with `jpeg` format will be generated and used as a fallback image for old browsers.

- In `sets` prop you can define different formats for each set. Defining different formats will help to improve browser compatibity.
  - If format does not present in a set it means that the set uses `format` props.
  - If format does not present in a set and `format` props is missing then image format will not change.

<code-group>
  <code-block label="String Prop" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-picture sets="300 (webp),300:600 (jpeg),600:900" ... />
    <!--               |   |  |    |   |    |     |   | -->
    <!--------- width -^   |  |    |   |    |     |   | -->
    <!--                   |  |    |   |    |     |   | -->
    <!------- breakpoint --^  |    |   |    |     |   | -->
    <!-- format --------------^    |   |    |     |   | -->
    <!--                           |   |    |     |   | -->
    <!---------------- width ------^   |    |     |   | -->
    <!--------------- breakpoint ------^    |     |   | -->
    <!--------------------------- format ---^     |   | -->
    <!--                                          |   | -->
    <!---------------- width ---------------------^   | -->
    <!--------------- breakpoint ---------------------^ -->
  </template>
  ```

  </code-block>
  <code-block label="Array Prop">

  ```vue{}[index.vue]
  <template>
    <nuxt-picture :sets="sets" ... />
  </template>

  <script>
  export default {
    data() {
      return {
        sets: [
          {
            width: 300,
            format: 'webp'
          },
          {
            breakpoint: 300,
            width: 600,
            format: 'jpeg'
          },
          {
            breakpoint: 600,
            width: 900
          }
        ]
      }
    }
  }
  </script>
  ```

  </code-block>
</code-group>
