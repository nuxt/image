# Strapi

Nuxt Image with Strapi integration

Integration between [Strapi](https://strapi.io) and the image module.

No specific configuration is required. You just need to specify `strapi` in your configuration to make it the default:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    strapi: {}
  }
})
```

Override default options:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    strapi: {
      baseURL: 'http://localhost:1337/uploads/'
    }
  }
})
```

## Modifiers
The `breakpoint` modifier is used to specify the size of the image.

By default, when the image is uploaded and **Enable responsive friendly upload** Strapi setting is enabled in the settings panel the plugin will generate the following responsive image sizes:

|  Name   | Largest Dimension |
| ------- | ----------------- |
| `small` | 500px             |
| `medium`| 750px             |
| `large` | 1000px            |

You can override the default breakpoints. See the [Upload configuration](https://strapi.io/documentation/developer-docs/latest/development/plugins/upload.html#configuration) in the Strapi documentation.

If you don't set breakpoint modifier, the original image size will be used:

```html
<NuxtImg provider="strapi" src="..." />
```

Define breakpoint modifier:
```html
<NuxtImg provider="strapi" src="..." :modifiers="{ breakpoint: 'small' }" />
```

::alert{type="info"}
Only one breakpoint can be modified per image.
::
