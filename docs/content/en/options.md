---
title: Options
description: ''
position: 4
category: Guide
---

To configure the image module and cutomize its behavior, you can use `image` property in the `nuxt.config.js`:

```js{}[nuxt.config.js]
export default {
  image: {
    // Options
  }
}
```
## `providers`


There are planty of CDNs and image providers, If you want to use your own provider instead of Nuxt's default provider you should define
your provides.  
For example if you want to use `twicpics` provider:

```js{}[nuxt.config.js]
export default {
  image: {
    providers: {
      twicpics: {
        baseURL: 'https://i5acur1u.twic.pics/'
      }
    }
  }
}
```

<!-- local provider -->
<!-- writing custom providers -->
<!-- provider usage -->

## `defaultProvider`

If you define multiple providers in your project, you can define default provider. I you do not set `defaultProvider`, your first provider picks as
default.

```js{}[nuxt.config.js]
export default {
  image: {
    defaultProvider: 'twicpics',
    providers: {
      local: {},
      twicpics: {
        baseURL: 'https://i5acur1u.twic.pics/'
      }
    }
  }
}
```

## `presets`

Presets are collections of pre-defined configuration for your projects.

```js{}[nuxt.config.js]
export default {
  image: {
    presets: [
      {
        name: 'small',
        modifiers: {
          contain: '50x50'
        }
      }
    ]
  }
}
```
