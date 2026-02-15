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

At a minimum, you must configure the `imgproxy` provider with the `baseURL`, `key` and `salt` set to your Imgproxy
instance:

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

## Processing of `fit` values by the imgproxy provider

The `fit` modifier controls how images are resized using **imgproxy**.  
It maps to the following imgproxy-related fields:

- `resizingType` — defines the resizing strategy (`fill`, `fit`, `force`)
- `extend` - enables canvas extension (letterboxing) when required

The behavior depends on whether valid `width` and/or `height` values are provided.

---

### Dimension Handling

Before applying any `fit` behavior:

- If both `width` and `height` are positive numbers → **both dimensions are considered defined**.
- If only one dimension is provided → behavior falls back to proportional resizing.
- If neither dimension is provided → resizing defaults to proportional behavior.

Exact box-based behaviors (`cover`, `contain`, `fill`, `outside`) fully apply only when both dimensions are defined.

---

### Supported `fit` Values

#### `cover` 

**Description**

Preserves an aspect ratio and ensures the image fully covers the target box.  
When both dimensions are defined, parts of the image may be cropped.

**Parameters Used**

- `resizingType = 'fill'` when both dimensions are provided
- `resizingType = 'fit'` when one or both dimensions are missing

**Behavior**

- With both dimensions: full coverage of the box (cropping allowed).
- With partial or no dimensions: proportional resizing without enforced coverage.

---

#### `contain`

**Description**

Preserves aspect ratio and fits the image within the target box.  
When both dimensions are defined, padding (letterboxing) is applied so the final image matches the exact dimensions.

**Parameters Used**

- `resizingType = 'fit'`
- `extend = true` when both dimensions are provided
- `extend = false` (or omitted) when not

**Behavior**

- Proportional scaling within bounds.
- Padding is applied only when both width and height are defined.
- With a single dimension, padding is not applied.

---

#### `fill`

**Description**

Ignores the original aspect ratio and stretches the image to exactly match the provided dimensions.

**Parameters Used**

- `resizingType = 'force'` when both dimensions are provided
- `resizingType = 'fit'` when one or both dimensions are missing

**Behavior**

- With both dimensions: image is stretched (aspect ratio ignored).
- Otherwise: proportional resizing is used instead of distortion.

---

#### `inside`

**Description**

Preserves an aspect ratio and resizes the image to be as large as possible while ensuring its dimensions are less than or
equal to the specified box.

**Parameters Used**

- `resizingType = 'fit'`

**Behavior**

- Always performs proportional scaling.
- Works consistently with one, two, or no defined dimensions.

---

#### `outside`

**Description**

Preserves an aspect ratio and resizes the image so that both dimensions are greater than or equal to the specified box.

**Implementation Note**

imgproxy does not provide a dedicated resizing strategy that guarantees true `outside` behavior without inspecting the
source image’s aspect ratio.  
This implementation approximates the behavior.

**Parameters Used**

- `resizingType = 'fill'` when both dimensions are provided
- `resizingType = 'fit'` when one or both dimensions are missing

**Behavior**

- With both dimensions: behaves similarly to `cover` (may crop).
- Otherwise: falls back to proportional resizing.

---

# Summary Table

| fit value | Both Dimensions Provided | resizingType | extend |
|-----------|--------------------------|--------------|--------|
| cover     | Yes                      | fill         | —      |
| cover     | No                       | fit          | —      |
| contain   | Yes                      | fit          | true   |
| contain   | No                       | fit          | false  |
| fill      | Yes                      | force        | —      |
| fill      | No                       | fit          | —      |
| inside    | Any                      | fit          | —      |
| outside   | Yes                      | fill         | —      |
| outside   | No                       | fit          | —      |

---

# Dimension Edge Cases

- If neither `width` nor `height` is provided, resizing defaults to proportional behavior.
- If only one dimension is provided, proportional scaling is applied.
- Exact box behaviors are guaranteed only when both dimensions are defined.

## Imgproxy Modifiers

By default, the Imgproxy provider has the following settings for modifiers

```typescript
const defaultModifiers: Partial<ImgproxyModifiers> = {
    resizingType: 'auto',
    gravity: 'ce',
    format: 'webp',
}
 ```

If you want to change them, you can define it `nuxt.config.ts` file.

In addition to the [standard modifiers](/usage/nuxt-img#modifiers), you can also use most
of [Imgproxy Options](https://docs.imgproxy.net/usage/processing#processing-options) by adding them to the `modifiers`
property with the following attribute names:

- `format`
- `resizingType`
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

> The provider does not verify the accuracy of your data entry. If you see “Invalid URL” from Imgproxy, check that the
> parameters are correct. Some parameters (e.g., `crop`) accept an object as input and convert the request into a valid
> string for your server. You can find more detailed information about all image processing options on
> the [Imgproxy](https://docs.imgproxy.net/usage/processing#processing-options) website.

Example 1: Cropping an image to a width and height of 500x500 and rotate by 180 degrees:

```vue

<NuxtImg
    provider="imgproxy"
    src="/some-image.jpg"
    width="500"
    height="500"
    :modifiers="{ rotate: 180 }"
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

Example 3: Using [presets](https://docs.imgproxy.net/configuration/options#presets):

```vue

<NuxtImg
    provider="imgproxy"
    src="/some-image.jpg"
    width="500"
    height="500"
    :modifiers="{ preset: 'my-preset' }"
/>
```

Example 4: Advanced image manipulation:

```vue

<NuxtImg
    provider="imgproxy"
    src="/some-image.jpg"
    width="100"
    height="100"
    :modifiers="{ 
       resize: 'fit:100:100:1:1',
       background: 'FFCC00',
       format: 'png',
       pixelate: 50,
     }"
/>
```




