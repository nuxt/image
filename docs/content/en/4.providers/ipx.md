---
menuTitle: IPX (static)
title: IPX Provider (static)
description: 'Nuxt Image internally use IPX as static provider.'
category: Providers
---

When no provider is specified globally, the default provider is `static` which uses [IPX](https://github.com/nuxt-contrib/ipx).

IPX is an opensource and self-hosted image optimizer based on [Sharp](https://github.com/lovell/sharp) developed by the Nuxt team.

The image module internally uses IPX for static image optimization but you can also self-host it as a runtime optimizer by enabling the provider.


### Static assets

It's common if you are using a third-party provider that you may want to also include some images
that are stored locally within your repo. 

```vue
<NuxtImg provider="static" src="/logo.png" width="300" height="200" />
```

This will load the image in as `/static/logo.png` and apply the IPX optimizations if applicable.


### Using `ipx` in production

#### Add `ipx` dependency

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

#### Add `serverMiddleware` handler

**If you are using Nuxt 2.16+ this is done automatically for you.**

However, if you are using Nuxt < 2.16, and you need to use the `ipx` provider at runtime, you will either need to add `@nuxt/image` to your _modules_ (instead of buildModules) or add the following code to your `nuxt.config`:

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
