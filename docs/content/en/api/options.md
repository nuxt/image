---
menuTitle: Options
title: Module Options
description: 'Nuxt Image is configured with sensible defaults.'
position: 301
category: API
---

To configure the image module and customize its behavior, you can use the `image` property in your `nuxt.config`:

```js{}[nuxt.config]
export default {
  image: {
    // Options
  }
}
```

## `sizes`

List of predefined sizes for responsive images. This sizes will use to generate resized and optimized version of an image.

```ts [nuxt.config.js]
export default {
  image: {
    sizes: [320, 420, 768, 1024, 1200]
  }
}

```

## `accept`

To enable image optimization on an external website, specify which domains are allowed to be optimized. This option will use to detect whether a remote image should be optimized or not. This is needed to ensure that external urls can't be abused.

```ts [nuxt.config.js]
export default {
  image: {
    accept: ['nuxtjs.org']
  }
}
```

## `intersectOptions`

The module uses [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect whether the image are in Viewport or not. Use this option to modify IntersectionObserver options.

```ts [nuxt.config.js]
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

  ```ts [nuxt.config.js]
  export default {
    image: {
      presets: {
        avatar: {
          modifiers: {
            format: 'jpg',
            width: 50,
            height: 50
          }
        }
      }
    }
  }
  ```
  </code-block>
  <code-block label="index.vue">

  ```html [index.vue]
  <template>
    <nuxt-img preset="avatar" src="/nuxt-icon.png" />
  </template>
  ```

  </code-block>
</code-group>

See:
- [How to use presets](/components/nuxt-img#preset)

## `providers`

In order to create and use [custom provider](/advanced/custom-provider), you need to use `providers` option and define your custom providers.

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
- [How to use provider](/components/nuxt-img#provider)
- [List of internal providers](/providers)
- [Create custom provider](/advanced/custom-provider)

## `provider`

If you want to use multiple providers in your project, you should pick one of them as the default provider. Default value for provider is `'static'`

```ts [nuxt.config.js]
export default {
  image: {
    provider: 'twicpics',
    twicpics: {
      baseURL: 'https://nuxt-demo.twic.pics'
    }
  }
}
```

## `static`

- `dir`: The root directory of the all images. By default nuxt image looks `static` dir to find original images,
- `clearCache`: The ipx has a caching stategy to clear cached images to reduce massive disk usages. You can schedule the cache cleaning job using `clearCache` option in provide options. By default this cron job is disabled.
- `cacheDir`: The directory to store the cached images.
- `sharp`: Modify default behavior of image opetimizer. Note that if you change this option, you need to clear ipx cache.

```js{}[nuxt.config.js]
export default {
  image: {
    static: {
      dir: '~/static',
      clearCache: false,
      cacheDir: '~~/node_modules/.cache/nuxt-img',
      // Here is complete list of available options: https://github.com/lovell/sharp/blob/master/lib/constructor.js#L132
      sharp: {}
    }
  }
}
```

Learn more about [IPX's options](/providers/ipx).