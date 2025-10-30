---
title: AWS Amplify
description: Nuxt Image has first class integration with AWS Amplify Hosting
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/awsAmplify.ts
    size: xs
---

Integration between [AWS Amplify Hosting](https://aws.amazon.com/amplify) and the image module.

This provider will be enabled by default in AWS Amplify deployments.

::alert{type="warning"}
This is an experimental preset and will be available soon! 🚀
::

## Domains

To use external URLs (images not in `public/` directory), hostnames should be whitelisted.

**Example:**

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    domains: ['avatars0.githubusercontent.com']
  }
})
```

## Sizes

Specify any custom `width` property you use in `<NuxtImg>`, `<NuxtPicture>` and `$img`.

If a width is not defined, image will fallback to the next bigger width.

**Example:**

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    screens: {
      icon: 40,
      avatar: 24
    }
  }
})
```

## Modifiers

All the default modifiers from [AWS's documentation](https://docs.aws.amazon.com/amplify/latest/userguide/integrate-image-optimization-framework.html#uri-request-parameters) are available.

```vue
<NuxtImg
  src="/test.jpg"
  height="512"
  width="512"
  :modifiers="{ flip: true }"
  :quality="90"
/>
```

## Options

### `formats`

- Type: **String[]** (optional)

Specify the image format allow list for optimization.
By default, the provider set the following formats: `['image/jpeg', 'image/png', 'image/webp', 'image/avif']`.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    awsAmplify: {
      formats: ['image/jpeg', 'image/png', 'image/webp']
    }
  }
})
```
