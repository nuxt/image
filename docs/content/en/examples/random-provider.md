---
title: Random Provider
description: ''
position: 9
category: Examples
---

Example of creating a `random` provider to fetch a random image on [Unsplash](https://unsplash.com).

Let's create a `./providers/random/` directory with two files inside:
- `index.js`: our entry point for our provider, exporting `runtime` and `runtimeOptions`
- `runtime.js`: our runtime sending back an url

<code-group>
  <code-block label="index.js" active>

  ```js{}[~/providers/random/index.js]
  export default function (providerOptions) {
    return {
      runtime: require.resolve('./runtime'),
      runtimeOptions: providerOptions
    }
  }
  ```

  </code-block>
  <code-block label="runtime.js">

  ```js{}[~/providers/random/runtime.js]  
  export default {
    getImage(src, modifiers, options) {
      return {
        url: 'https://source.unsplash.com/random/600x400'
      }
    }
  }
  ```
  </code-block>
</code-group>

Let's use our random provider in our Nuxt application:

<code-group>
  <code-block label="nuxt.config.js" active>

  ```js{}[nuxt.config.js]
  export default {
    image: {
      providers: {
        random: '~/providers/random'
      }
    }
  }
  ```
  </code-block>

  <code-block label="pages/index.vue">

  ```vue{}[~/pages/index.js]
  <template>
    <nuxt-img provider="random"random src="/" width="600" height="400" />
  </template>
  ```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-img provider="random" src="/" width="600" height="400"></nuxt-img>
  </div>

  </code-block>

</code-group>
