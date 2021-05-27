---
title: IPX Provider
description: 'Self hosted image provider'
navigation:
  title: IPX
---


Nuxt Image comes with a preconfigured instance of [ipx](/providers/ipx) to provide image transformations based on [sharp](https://github.com/lovell/sharp).
IPX is an open source, self-hosted image optimizer based on [sharp](https://github.com/lovell/sharp).

## Self-hosting `ipx` in production

### Using CDN

This approach is recommended if you are planning to use images in a high load production and using other providers is not suitable.

### Add `ipx` dependency

You'll need to ensure that `ipx` is in your production dependencies.

<d-code-group>
  <d-code-block label="Yarn" active>

```bash
yarn add ipx
```

  </d-code-block>
  <d-code-block label="NPM">

```bash
npm install ipx
```

  </d-code-block>
</d-code-group>

### Add `serverMiddleware` handler

Finally, just add `@nuxt/image` to your `modules` (instead of `buildModules`) in `nuxt.config`. This will ensure that the `/_ipx` endpoint continues to work at runtime.


### Programmatic middidleware

If you have an advanced use case, you may instead add the following code to your `nuxt.config` (or create a custom server middleware file directly that handles the `/_ipx` endpoint):

```js [nuxt.config.js]
import path from 'path'
import { createIPX, createIPXMiddleware } from 'ipx'

const ipx = createIPX({
  dir: path.join(__dirname, 'static'),
  // https://image.nuxtjs.org/api/options#domains
  domains: [],
  // Any options you need to pass to sharp
  sharp: {}
})

export default {
  serverMiddleware: [
    {
      path: '/_ipx',
      handler: createIPXMiddleware(ipx)
    }
  ]
}
```
