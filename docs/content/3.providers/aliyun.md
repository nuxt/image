---
title: Aliyun
description: Nuxt Image has first class integration with Aliyun.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/aliyun.ts
    size: xs
---

Integration between [Aliyun CDN](https://cdn.console.aliyun.com/) and the image module.

To use this provider you just need to specify the base url (zone) of your service:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    aliyun: {
      baseURL: "https://that-test.site",
    },
  },
});
```

**Example:**

```vue
<NuxtImg
  provider="aliyun"
  src="/burger.jpeg"
  height="300"
  :modifiers="{ fit: 'contain' }"
/>
```

## Options

### `baseURL`

Default: `/`

Your deployment's domain (zone).

## modifiers

**Example:**

```js
{
  resize: {
    fw: 900,
    fh: 200
  },
  rotate:180,
  bright:50
  ...
}
```

For more modifiers configuration items, see [aliyun cdn docs](https://help.aliyun.com/zh/cdn/user-guide/image-editing/)
