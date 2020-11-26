---
title: Module Options
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

## `sizes`

List of predefined sizes for responsive images. This sizes will use to generate resized and optimized version of an image.

```js{}[nuxt.config.js]
export default {
  image: {
    sizes: [320, 420, 768, 1024, 1200]
  }
}

```

## `accept`

To enable image optimization on an external website, specify which domains are allowed to be optimized. This option will use to detect whether a remote image should be optimized or not. This is needed to ensure that external urls can't be abused.

```js{}[nuxt.config.js]
  export default {
    image: {
      accept: [ 'nuxtjs.org' ]
    }
  }
```

## `intersectOptions`

The module uses [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect whether the image are in Viewport or not. Use this option to modify IntersectionObserver options.

```js{}[nuxt.config.js]
  export default {
    image: {
      intersectOptions: {
        rootMargin: '50px'
      }
    }
  }
```

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
    <nuxt-img preset="avatar" src="/nuxt-icon.png" />
  </template>
  ```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-img preset="avatar" src="/nuxt-icon.png"></nuxt-img>
  </div>

  </code-block>
</code-group>

See:
- [How to use presets](/nuxt-img#preset)

## `providers`

In order to create and use [custom provider](/custom-provider), you need to use `providers` option and define your custom providers.

<code-group>
  <code-block label="nuxt.config.js" active>

  ```js{}[nuxt.config.js]
  export default {
    image: {
      providers: {
        random: {
          provider: '~/providers/random',
          options: {}
        }
      }
    }
  }
  ```
  </code-block>
  <code-block label="index.vue">

  ```vue{}[index.vue]
  <template>
    <nuxt-img provider="random" src="main.png" width="300" height="169" />
  </template>
  ```

  </code-block>
</code-group>

<!-- writing custom providers -->
See:
- [How to use provider](/nuxt-img#provider)
- [List of internal providers](/providers)
- [Create custom provider](/custom-provider)

## `provider`

If you want to use multiple providers in your project, you should pick one of them as the default provider. If you do not set `provider`, module uses `ipx` as the default provider.

```js{}[nuxt.config.js]
export default {
  image: {
    provider: 'twicpics',
    twicpics: {
      baseURL: 'https://i5acur1u.twic.pics/'
    }
  }
}
```

## `local`

Internally nuxt image uses [ipx](https://github.com/nuxt-contrib/ipx) to modify and optimize images.  

- `dir`: The root directory of the all images. By default nuxt image looks `static` dir to find original images, 
- `clearCache`: The ipx has a caching stategy to clear cached images to reduce massive disk usages. You can schedule the cache cleaning job using `clearCache` option in provide options. By default this cron job is disabled.
- `cacheDir`: The directory to store the cached images.
- `sharp`: Modify default behavior of image opetimizer. Note that if you change this option, you need to clear ipx cache.

```js{}[nuxt.config.js]
export default {
  image: {
    local: {
      /**
       * Input directory for images
       **/
      dir: '~/static',
      /**
       * Cache directory for optimized images
       **/
      cacheDir: '~~/node_modules/.cache/nuxt-img',
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
