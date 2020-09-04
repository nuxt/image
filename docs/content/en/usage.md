---
title: Usage
description: ''
position: 2
category: Guide
---

## simple usage

```vue{}[index.vue]
<template>
  <nuxt-image src="/path/to/image">
</template>
```

## provider

Using specific provider

<code-group>
  <code-block label="index.vue" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-image src="twicpics:/path/to/image">
  </template>
  ```

  </code-block>
  <code-block label="nuxt.config.js">

  ```js{}[nuxt.config.js]
  export default {
    image: {
      providers: {
        local: {},
        twicpics: {
          baseURL: 'https://i5acur1u.twic.pics/'
        }
      }
    }
  }
  ```
  </code-block>
</code-group>


## presets

Using specific provider

<code-group>
  <code-block label="index.vue" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-image src="+small:/path/to/image">
  </template>
  ```

  </code-block>
  <code-block label="nuxt.config.js">

  ```js{}[nuxt.config.js]
  export default {
    image: {
      presets: [
        {
          name: 'small',
          modifiers: {
            contain: '50x50'
          }
        }
      ]
    }
  }
  ```
  </code-block>
</code-group>



## provider + presets

Using specific provider

<code-group>
  <code-block label="index.vue" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-image src="twicpics+small:/path/to/image">
  </template>
  ```

  </code-block>
  <code-block label="nuxt.config.js">

  ```js{}[nuxt.config.js]
  export default {
    image: {
      presets: [
        {
          name: 'small',
          modifiers: {
            contain: '50x50'
          }
        }
      ],
      providers: {
        local: {},
        twicpics: {
          baseURL: 'https://i5acur1u.twic.pics/'
        }
      }
    }
  }
  ```
  </code-block>
</code-group>
