---
title: IPX Provider
description: 'Self hosted image provider'
navigation:
  title: IPX
---

Nuxt Image comes with a [preconfigured instance](/getting-started/providers#default-provider) of [ipx](https://github.com/unjs/ipx). An open source, self-hosted image optimizer based on [sharp](https://github.com/lovell/sharp).

## Using `ipx` in production

Use IPX for self-hosting as an alternative to use service providers for production.

:::alert{type="info"}
  You don't need to follow this section if using `target: 'static'`.
:::

### Runtime Module

Just add `@nuxt/image` to `modules` (instead of `buildModules`) in `nuxt.config`. This will ensure that the `/_ipx` endpoint continues to work in production.

### Alternative: serverMiddleware

If you have an advanced use case, you may instead create a custom server middleware that handles the `/_ipx` endpoint:

1. Add `ipx` as a dependency:

:::::code-group
  ::::code-block{label="yarn" active}

  ```bash
  yarn add ipx
  ```

  ::::
  ::::code-block{label="npm"}

  ```bash
  npm install ipx
  ```

  ::::
:::::

2. Create `server/middleware/ipx.js`:

```js [server/middleware/ipx.js]
import { createIPX, createIPXMiddleware } from 'ipx'

// https://github.com/unjs/ipx
const ipx = createIPX(/* options */)

export default createIPXMiddleware(ipx)
```

3. Add `/_ipx` to `serverMiddleware`:


```js [nuxt.config.js]

export default {
  serverMiddleware: {
    '/_ipx': '~/server/middleware/ipx.js'
  }
}
```
