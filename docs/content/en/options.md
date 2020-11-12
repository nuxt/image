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

<!-- writing custom providers -->
See:
- [How to use provider](/nuxt-image#provider)
- [List of internal providers](/providers)
- [Create custom provider](/custom-provider)

## `presets`

Presets are collections of pre-defined configurations for your projects. Presets will help you to unify images all over your project.

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

## `provider`

If you want to use multiple providers in your project, you should pick one of them as the default provider. If you do not set `provider`, module uses `ipx` as the default provider.

```js{}[nuxt.config.js]
export default {
  image: {
    provider: 'twicpics',
    providers: {
      twicpics: {
        baseURL: 'https://i5acur1u.twic.pics/'
      }
    }
  }
}
```

## `ipx`

Internally nuxt image uses [ipx](https://github.com/nuxt-contrib/ipx) to modify and optimize images.  

- `dir`: The root directory of the all images. By default nuxt image looks `static` dir to find original images, 
- `clearCache`: The ipx has a caching stategy to clear cached images to reduce massive disk usages. You can schedule the cache cleaning job using `clearCache` option in provide options. By default this cron job is disabled.
- `cacheDir`: The directory to store the cached images.
- `sharp`: Modify default behavior of image opetimizer. Note that if you change this option, you need to clear ipx cache.

```js{}[nuxt.config.js]
export default {
  image: {
    ipx: {
      /**
       * Input directory for images
       **/
      dir: '~/static',
      /**
       * Cache directory for optimized images
       **/
      cacheDir: '~~/node_modules/.cache/nuxt-image',
      /**
       * Enable/Disable cache cleaning cron job
       **/
      clearCache: false,
      /**
       * Modify default behavior of image optimizer
       **/
      sharp: {
        // Here is complete list of available options: https://github.com/lovell/sharp/blob/master/lib/constructor.js#L132
      }
    }
  }
}
```

## `sizes`

List of predefined sizes for responsive images. This sizes will use to generate resized and optimized version of an image.


```js{}[nuxt.config.js]
export default {
  image: {
    sizes: [320, 420, 768, 1024, 1200]
  }
}

```