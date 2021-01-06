---
title: Create Custom Provider
description: ''
position: 6
category: Guide
---

Although the image module offers multiple internal providers, you may want/need to write your custome provider.  
Image provider have three different parts with specific roles.

## Provider Main
This is the entry point of every provider, this part executes on initialization process to initialize provider specific tasks.

```js
export default function(providerOptions) {
  // Init provider

  return {
    // Absolute path to runtime file
    runtime: require.resolve('./runtime'),

    // Public options to use in runtime
    runtimeOptions: providerOptions,

    // A server middleware to optimize images
    // This propery is optional you can omit this if don't need it
    middleware: createServerMiddleware()
  }
}
```

- `providerOptions`: The provider options that defined in `nuxt.config`.
- `runtime`: The absolute path to runtime file.
- `runtimeOptions`: Public options to use in runtime. Do not pass any secret info here because these options will be used in client side.
- `middleware`: A server middleware to optimize images.


## Provider Runtime

The runtime will recieve a src, image modifiers and its provider options and generates a url for optimized images. Runtime is a universal and could run in both server side and client side.

```js
export default {
  getImage(src, modifiers, options) {
    const { width, height, format, fit, ...providerModifiers } = modifiers;
    const operations = []

   // process modifiers
    
    const operationsString = operations.join(',')
    return {
      url: options.baseURL + operationsString + src,
      static: false,
      getInfo: () => {
        return {
          width: 1,
          height: 1,
          bytes: 1
        }
      }
    }
  }
}
```
### Parameters
- `src`: Source path of the image
- `modifiers`: List of image modifiers that defined in image component or a preset
- `options`: `runtimeOptions` returned by provider main
### Return
- `url`: Absolute or relative url of optimized image.
- `static`: A boolean value that determine whether the image should generate on static generation or not. If it is `true` during `nuxt generate` this image will be downloaded and saved in `generate.outDir` to server as a static image.
- `getInfo`: An Async function that used to detect `width` and `height` of the image. This `width` and `height` will be used to calculate the aspect ratio of the image.


## Provider Middleware

Although there is planty of great image provider services out there but sometimes having your own is more fun and may be more customizable. If you want to use image manipulation libraries like [node-canvas](https://github.com/Automattic/node-canvas), [jimp](https://github.com/oliver-moran/jimp), [GraphicsMagick](https://github.com/aheckmann/gm) or any other great library you need to create a middleware for your provider.  
A middleware is just a [server-middleware for nuxt](https://nuxtjs.org/api/configuration-servermiddleware#custom-server-middleware) that receives generated url and return optimized image.  
Below example shows simple middleware that returns single image.

```js
function createMiddleware(options) {
  return function (req, res) {
    const file = './static/nuxt-icon.png';

    res.setHeader('Content-type', 'image/png');

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
  }
}

export default function(providerOptions) {

  return {
    runtime: require.resolve('./runtime'),
    runtimeOptions: providerOptions,
    middleware: createMiddleware(providerOptions)
  }
}
```

## Use your provider

### Register provider

After you create your own provider, you should register it in `nuxt.config`. In order to do that create a property inside `image.provider`.  

```js
export default {
  ...
  image: {
    providers: {
      customProvider: {
        name: 'customProvider', // optional value to overrider provider name
        provider: '~/providers/custom', // Path to custom provider
        options: {
          // ... provider options
        }
      } 
    }
  }
}
```

### Use provider in `nuxt-image`
To use your provider, write your provider's name before the src. Read [provider doc](/nuxt-image#provider)

```vue{}[index.vue]
<template>
  <nuxt-image src="custom:/main.png" />
</template>
```
