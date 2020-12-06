---
title: Local Provider
description: ''
position: 10
category: Providers
---


Internally nuxt image uses [ipx](https://github.com/nuxt-contrib/ipx) to modify and optimize images.  

- `dir`: The root directory of the all images. By default nuxt image looks `static` dir to find original images, 
- `clearCache`: The ipx has a caching stategy to clear cached images to reduce massive disk usages. You can schedule the cache cleaning job using `clearCache` option in provide options. By default this cron job is disabled.
- `cacheDir`: The directory to store the cached images.
- `sharp`: Modify default behavior of image optimizer. Note that if you change this option, you need to clear ipx cache.

```js{}[nuxt.config.js]
export default {
  image: {
    local: {
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
