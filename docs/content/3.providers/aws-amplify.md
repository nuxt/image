---
title: AWS Amplify
description: Nuxt Image has first class integration with AWS Amplify Hosting
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/awsAmplify.ts
    size: xs
---

Integration between [AWS Amplify Hosting](https://aws.amazon.com/amplify/) and the image module.

This provider will be enabled by default in AWS Amplify deployments.

::alert{type="warning"}
This is an experimental preset and will be available soon! 🚀
::

## Domains

To use external URLs (images not in `public/` directory), hostnames should be whitelisted.

**Example:**

```ts [nuxt.config]
export default {
  image: {
    domains: [
      'avatars0.githubusercontent.com'
    ]
  }
}
```

## Sizes

Specify any custom `width` property you use in `<NuxtImg>`, `<NuxtPicture>` and `$img`.

If a width is not defined, image will fallback to closest possible width.

**Example:**

```ts [nuxt.config]
export default {
  image: {
    screens: {
      icon: 40,
      avatar: 24
    }
  }
}
```
