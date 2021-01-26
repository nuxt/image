---
menuTitle: IPX
title: IPX Provider
description: 'Nuxt Image internally use IPX as static provider.'
category: Providers
position: 404
---

[IPX](https://github.com/nuxt-contrib/ipx) is an opensource and self-hosted image optimizer based on [Sharp](https://github.com/lovell/sharp) developed by the Nuxt team.

The image module internally uses IPX for static image optimization but you can also self-host it as a runtime optimizer by enabling provider.

- `dir`: The root directory of the all images.
- `clearCache`: The ipx has a caching stategy to clear cached images to reduce massive disk usages. You can schedule the cache cleaning job using `clearCache` option in provide options. By default this cron job is disabled.
- `cacheDir`: The directory to store the cached images.
- `sharp`: Modify default behavior of image optimizer. Note that if you change this option, you need to clear ipx cache.

```js{}[nuxt.config.js]
export default {
  image: {
    static: {
      /**
       * Cache directory for optimized images
       **/
      // cacheDir: '~~/node_modules/.cache/nuxt-img',
      /**
       * Enable/Disable cache cleaning cron job
       **/
      // clearCache: false,
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
