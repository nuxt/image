---
title: Imgproxy
description: Nuxt Image has first class integration with Imgproxy.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/imgproxy.ts
    size: xs
---

Integration between [Imgproxy](https://imgproxy.net/) and the image module.

At a minimum, you must configure the `imgproxy` provider with the `baseURL`, `key` and `salt` set to your Imgproxy instance:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    imgproxy: {
      baseURL: 'http://localhost:8080/', 
      key: 'ee3b0e07dfc9ec20d5d9588a558753547a8a88c48291ae96171330daf4ce2800',
      salt: '8dd0e39bb7b14eeaf02d49e5dc76d2bc0abd9e09d52e7049e791acd3558db68e',
    }
  }
})
```

## Imgproxy `fit` Values

All `fit` values are converted to [`resizing_type`](https://docs.imgproxy.net/usage/processing#resizing-type) option provided by Imgproxy. 
The `fit` option is kept for backwards compatibility with @nuxt/image. The `contain` value is converted to `fill`.

## Imgproxy Modifiers

By default, the Imgproxy provider has the following settings for modifiers
```typescript
const defaultModifiers: Partial<ImgproxyModifiers> = {
  resizingType: 'fit',
  gravity: 'ce',
  enlarge: true,
  format: 'webp',
}
 ```

If you want to change them, define them in your nuxt.config.ts file.

In addition to the [standard modifiers](/usage/nuxt-img#modifiers), you can also use most of [Imgproxy Options](https://docs.imgproxy.net/usage/processing#processing-options) by adding them to the `modifiers` property with the following attribute names:

- `format` 
- `resizingType` - alias for `fit`
- `resize`
- `size`
- `minWidth`
- `minHeight`
- `zoom`
- `dpr`
- `enlarge`
- `extend`
- `extendAspectRatio`
- `gravity`
- `crop`
- `autoRotate`
- `rotate`
- `background`
- `sharpen`
- `pixelate`
- `stripMetadata`
- `keepCopyright`
- `stripColorProfile`
- `enforceThumbnail`
- `maxBytes`
- `raw`
- `cachebuster`
- `expires`
- `filename`
- `returnAttachment`
- `preset`
- `maxSrcResolution`
- `maxSrcFileSize`
- `maxAnimationFrames`
- `maxAnimationFrameResolution`
- `maxResultDimension`

> The provider does not verify the accuracy of your data entry. If you see “Invalid URL” from Imgproxy, check that the parameters are correct. Some parameters (e.g., `crop`) accept an object as input and convert the request into a valid string for your server. You can find more detailed information about all modifiers on the [Imgproxy](https://docs.imgproxy.net/usage/processing#processing-options) website.

Example 1: Cropping an image to a width and height of 500x500 and rotate by 180 degrees:

```vue
<NuxtImg
  provider="imgproxy"
  src="/some-image.jpg"
  width="500"
  height="500"
  :modifiers="{ rotate: '180' }"
/>
```

Example 2: Add blur to an image:

```vue
<NuxtImg
  provider="imgproxy"
  src="/some-image.jpg"
  width="500"
  height="500"
  :modifiers="{ blur: 100 }"
/>
```

Example 2: Using [presets](https://docs.imgproxy.net/configuration/options#presets):

```vue
<NuxtImg
  provider="imgproxy"
  src="/some-image.jpg"
  width="500"
  height="500"
  :modifiers="{ preset: 'my-preset' }"
/>
```




