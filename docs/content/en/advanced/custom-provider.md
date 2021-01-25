---
title: Create Custom Provider
description: ''
category: Advanced
position: 502
---

Although the image module offers multiple internal providers, you may want/need to write your custome provider integration.

## Provider Entry

The runtime will recieve a src, image modifiers and its provider options and generates a url for optimized images. Runtime is a universal and could run in both server side and client side.

```js
import { joinURL } from 'ufo'
// import {} from '~image'

export function getImage(src, { modifiers, baseURL } = {}) {
  const { width, height, format, fit, ...providerModifiers } = modifiers;
  const operations = []
  // process modifiers
  const operationsString = operations.join(',')
  return {
    url: joinURL(baseURL, operationsString, src)
  }
}
```

### Parameters

- `src`: Source path of the image
- `modifiers`: List of image modifiers that defined in image component or a preset
- `options`: `runtimeOptions` returned by provider main

### Return

- `url`: Absolute or relative url of optimized image.
- `isStatic`: A boolean value that determine whether the image should generate on static generation or not. If it is `true` during `nuxt generate` this image will be downloaded and saved in `generate.outDir` to server as a static image.


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

There are plenty of useful utilities can be used to write providers by importing from `~img`. See [src/runtime/providers](https://github.com/nuxt/image/tree/dev/src/runtime/providers) for more info.
