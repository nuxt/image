---
title: IPX
description: Self hosted image provider
---

Nuxt Image comes with a [preconfigured instance](/getting-started/providers#default-provider) of [ipx](https://github.com/unjs/ipx). An open source, self-hosted image optimizer based on [sharp](https://github.com/lovell/sharp).

## Using `ipx` in production

Use IPX for self-hosting as an alternative to use service providers for production.

::alert{type="info"}
  You don't need to follow this section if using `target: 'static'`.
::

### Runtime Module

Just add `@nuxt/image` to `modules` (instead of `buildModules`) in `nuxt.config`. This will ensure that the `/_ipx` endpoint continues to work in production.

### Advanced: Custom ServerMiddleware

If you have a use case of a custom IPX instance serving other that `static/` dir, you may instead create a server Middleware that handles the `/_ipx` endpoint:

1. Add `ipx` as a dependency:

::code-group
  ::code-block{label="yarn" active}

  ```bash
  yarn add ipx
  ```

  ::
  ::code-block{label="npm"}

  ```bash
  npm install ipx
  ```

  ::
::

2. Create `server/middleware/ipx.js`:

```js [server/middleware/ipx.js]
import { createIPX, createIPXMiddleware } from 'ipx'

// https://github.com/unjs/ipx
const ipx = createIPX({
  dir: '', // absolute path to images dir
  domains: [], // allowed external domains (should match domains option in nuxt.config)
  alias: {}, // base alias
  sharp: {}, // sharp options
})

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

## Additional Modifiers

You can use [additional modifiers](https://github.com/unjs/ipx/#modifiers) supported by IPX.

**Example:**

```html
<nuxt-img src="/image.png" :modifiers="{ grayscale: true, tint: '#00DC82' }" />
```

### Animated Images

::alert{type="info"}
This feature is currently experimental. When using, `gif` format is converted to `webp`
([check browser support](https://caniuse.com/webp)). Setting size is also not supported yet (check [lovell/sharp#2275](https://github.com/lovell/sharp/issues/2275) and [unjs/ipx#35](https://github.com/unjs/ipx/issues/35)).
::

**Example:**

```html
<nuxt-img src="/image.gif" :modifiers="{ animated: true }" />
```
