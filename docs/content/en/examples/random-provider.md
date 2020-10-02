---
title: Random Provider
description: ''
position: 5
category: Examples
---

<code-group>
  <code-block label="Provider Main" active>

  ```js{}[~/providers/random/index.js]
  export default function(providerOptions) {
    return {
        runtime: require.resolve('./runtime'),
        runtimeOptions: providerOptions
    }
  }
  ```

  </code-block>
  <code-block label="Runtime">

  ```js{}[~/providers/random/runtime.js]  
  export default {
    generateURL(src, modifiers, options) {
      return {
        url: 'https://source.unsplash.com/random/600x400'
      }
    }
  }
  ```
  </code-block>
  <code-block label="nuxt.config">

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

  <code-block label="Page">

  ```vue{}[~/pages/index.js]
  <template>
    <nuxt-image src="random:/" width="600px" height="400px" />
  </template>
  ```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-image src="random:/" width="600px" height="400px" />
  </div>

  </code-block>
</code-group>