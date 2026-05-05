---
title: Directus
description: Nuxt Image with Directus integration.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/directus.ts
    size: xs
---

To use this provider you only need to specify the base URL of your Directus instance.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    directus: {
      // This URL needs to include the final `assets/` directory
      baseURL: 'http://localhost:8055/assets'
    }
  }
})
```

## Props

The NuxtImg Props map cleanly to the Directus Transforms.

```vue
<NuxtImg
  provider="directus"
  src="ad514db1-eb90-4523-8183-46781437e7ee"
  height="512"
  width="200"
  fit="inside"
  quality="20"
/>
```

### Modifiers

The `modifiers` object is used for Directus specific features. All modifiers are optional.

#### Examples of Modifiers

::tabs{.w-full}
:::tabs-item{label="Modifiers"}

```vue
<NuxtImg
  provider="directus"
  :modifiers="{
    withoutEnlargement: 'true',
    transforms: [['blur', 4], ['negate']]
  }"
/>
```

:::

:::tabs-item{label="Keyed Modifier"}

```vue
<NuxtImg
  provider="directus"
  :modifiers="{
    key: "system-large-cover"
  }"
/>
```

:::
::

#### All Modifiers

::field-group

::field{name="withoutEnlargement" type="boolean"}
Disable automatically upscaling the image when true.
::

::field{name="transforms" type="['string', ...any][]"}
A pipeline of transforms to tell Directus how to modify the image before sending.
:::collapsible

| **[Sharp Operation](https://sharp.pixelplumbing.com/api-operation/)**| **Options**| **Example Usage**|
|----------------------|--------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------|
| **rotate**| \[angle?: number, options?: \{ background: Color \} \]| \['rotate', 90\] or \['rotate', 90, \{ background: 'white' \} \]|
| **flip**| \[]| \['flip'\]|
| **flop**| \[]| \['flop'\]|
| **sharpen**| \[sigma?: number\] \| \[options?: \{ sigma?: number, m1?: number, m2?: number, x1?: number, y2?: number, y3?: number \} \]| \['sharpen', 1.5\] or \['sharpen', \{ sigma: 1.5, m1: 0.5 \} \]|
| **median**| \[size?: number\]| \['median', 5\]|
| **blur**| \[sigma?: number\] \| \[options?: \{ sigma?: number, precision?: 'integer' \| 'float' \| 'approximate', minAmplitude?: number \} \]| \['blur', 2\] or \['blur', \{ sigma: 2, precision: 'float' \} \]|
| **flatten**| \[options?: \{ background: Color \} \]| \['flatten', \{ background: 'black' \} \]|
| **unflatten**| \[]| \['unflatten'\]|
| **gamma**| \[gamma?: number, gammaOut?: number\]| \['gamma', 2.2\] or \['gamma', 2.2, 1.8\]|
| **negate**| \[options?: \{ alpha?: boolean \} \]| \['negate', \{ alpha: true \} \]|
| **normalize** or **normalise**| \[lower?: number, upper?: number\]| \['normalize', 0, 255\]|
| **clahe**| \[options?: \{ width: number, height: number, maxSlope?: number \} \]| \['clahe', \{ width: 8, height: 8 \} \]|
| **convolve**| \[kernel: \{ width: number, height: number, kernel: number\[], offset?: number \} \]| \['convolve', \{ width: 3, height: 3, kernel: [1, 1, 1, 1, 1, 1, 1, 1, 1], offset: 0 \} \]|
| **threshold**| \[value?: number, options?: \{ grayscale?: boolean \} \]| \['threshold', 128\] or \['threshold', 128, \{ grayscale: true \} \]|
| **linear**| \[a?: number \| number\[], b?: number \| number\[]\]| \['linear', 1.2, 0\] or \['linear', [1.2, 1.0], [0, 255]\]|
| **recomb**| \[matrix: number\[\]\[\]\]| \['recomb', \[\[0.5, 0.5, 0.5\], [0.5, 0.5, 0.5\], [0.5, 0.5, 0.5\]\] \]|
| **modulate**| \[options?: \{ brightness?: number, saturation?: number, hue?: number, lightness?: number \} \]| \['modulate', \{ brightness: 1.2, saturation: 1.5 \} \]|
| **tint**| \[color: Color\]| \['tint', 'red'\]|
| **grayscale** or **greyscale**| \[]| \['grayscale'\]|
| **pipelineColorspace** or **pipelineColourspace**| \[colorspace: SharpColorspace\]| \['pipelineColorspace', 'srgb'\]|
| **toColorspace** or **toColourspace**| \[colorspace: SharpColorspace\]| \['toColorspace', 'rgb'\]|
| **removeAlpha**| \[]| \['removeAlpha'\]|
| **ensureAlpha**| \[alpha?: number\]| \['ensureAlpha', 0.5\]|
| **extractChannel**| \[channel: 'red' \| 'green' \| 'blue' \| 'alpha'\]| \['extractChannel', 'red'\]|

:::

:::note
Directus defaults `ASSETS_TRANSFORM_MAX_OPERATIONS` to `5`. If you need more, it is recommended that you utilize a `key`ed transform. You can modify your [Directus Configuration](https://directus.io/docs/configuration/files#assets) to accommodate more transforms if necessary.
:::

::field{name="key" type="string"}
Sets a unique identifier for allowing faster and easier image transformation requests.
::
