---
title: Options
description: ''
position: 4
category: Guide
---

To configure the image module and customize its behavior, you can use the `image` property in your `nuxt.config.js`:

```js{}[nuxt.config.js]
export default {
  image: {
    // Options
  }
}
```

## `providers`

Providers are an integration between the image module and images service providers like cloudinary. Using a specific provider means that your images are being transformed by the specific service.
There are plenty of image service providers. Currently we are supporting some providers out of box.

To use any provider, list them inside `nuxt.config.js`. You can use [internal providers](/providers) or [create a custom provider](/custom-provider).
Here is a sample to use `cloudinary`:

<code-group>
  <code-block label="nuxt.config.js" active>

  ```js{}[nuxt.config.js]
  export default {
    image: {
      providers: {
        cloudinary: {
          baseURL: 'https://res.cloudinary.com/nuxt/image/upload/'
        }
      }
    }
  }
  ```
  </code-block>
  <code-block label="index.vue">

  ```vue{}[index.vue]
  <template>
    <nuxt-image src="cloudinary:/remote/nuxt-org/blog/going-full-static/main.png" width="300" height="169" />
  </template>
  ```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-image src="cloudinary:/remote/nuxt-org/blog/going-full-static/main.png" width="300" height="169"></nuxt-image>
  </div>

  </code-block>
</code-group>

<!-- local provider -->
<!-- writing custom providers -->
See:
- [How to use provider](/nuxt-image#provider)
- [List of internal providers](/providers)
- [Create custom provider](/custom-provider)

## `presets`

Presets are collections of pre-defined configuration for your projects. Presets will help you to unify images all over your project.

<code-group>
  <code-block label="nuxt.config.js" active>

  ```js{}[nuxt.config.js]
  export default {
    image: {
      presets: [
        {
          name: 'avatar',
          modifiers: {
            format: 'jpg',
            width: 50,
            height: 50
          }
        }
      ]
    }
  }
  ```
  </code-block>
  <code-block label="index.vue">

  ```vue{}[index.vue]
  <template>
    <nuxt-image legacy src="+avatar:/nuxt-icon.png" />
  </template>
  ```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-image legacy src="+avatar:/nuxt-icon.png"></nuxt-image>
  </div>

  </code-block>
</code-group>

See:
- [How to use presets](/nuxt-image#preset)

## `defaultProvider`

If you want to use multiple providers in your project, you should pick one of them as the default provider. If you do not set `defaultProvider`, your first provider is picked as default.

```js{}[nuxt.config.js]
export default {
  image: {
    defaultProvider: 'twicpics',
    providers: {
      local: {},
      twicpics: {
        baseURL: 'https://i5acur1u.twic.pics/'
      }
    }
  }
}
```
