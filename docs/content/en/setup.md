---
title: Setup
description: ''
position: 2
category: Guide
---

Using image module in your NuxtJS project is only one command away ✨

## Installation

Add `@nuxt/image` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add --dev @nuxt/image
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install --save-dev @nuxt/image
  ```

  </code-block>
</code-group>




Next, you need to register module inside `nuxt.config`:

```bash{}[.nuxt.config.js]
export default {
  modules: [
    '@nuxt/image'
  ]
}
```

That's it ✨!

Now you can start using `<nuxt-image>` components in your project.

## Configure

Then, add `image` section in `nuxt.config.js`:

```js[nuxt.config.js]
export default {
  image: {
    // Options
  }
}
```

See [module options](/options).
