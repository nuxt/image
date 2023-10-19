---
title: Twicpics
description: Nuxt Image internally use Twicpics as static provider.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/twicpics.ts
    size: xs
---

Integration between [Twicpics](https://www.twicpics.com/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider) and the image module.

## What is TwicPics?

[Twicpics](https://www.twicpics.com/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider) is a Responsive Image Service Solution (SaaS) that enables on-demand responsive image generation.

Using the TwicPics Provider you can, out of the box, benefit from at least :
- performance of our network: global CDN, optimized protocols and competitive caching
- ideal compression: modern technology and Next-Gen formats (TwicPics delivers [`WebP`](https://en.wikipedia.org/wiki/WebP) natively for accounting browsers and can also delivers [`avif`](https://en.wikipedia.org/wiki/AVIF))

And using the TwicPics API, you will be able to access all these features: [smart cropping with TwicPics focus auto](#focus), [true color](#truecolor), [flip](#flip), [turn](#turn), [crop](#crop), [zoom](#zoom).

## Requirement

The only requirement is to have a TwicPics account.
If you don't already have one, you can easily [create your own TwicPics account for free](https://account.twicpics.com/signup/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider).

## Setup

You just need to configure the `TwicPics` provider with the `baseURL` set to your TwicPics [Domain](https://www.twicpics.com/docs/getting-started/subdomain/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider).

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    twicpics: {
      baseURL: 'https://<your-twicpics-domain>/'
      // Feel free to use our demo domain to try the following examples.
      // baseUrl: 'https://demo.twic.pics/'
    }
  }
})
```

## Standard properties

TwicPics Provider complies with the documentation of [nuxt-img](/usage/nuxt-img) and [nuxt-picture](/usage/nuxt-picture).

### fit

`fit` determines how the image is resized in relation to the parameters `height` and `width`.

TwicPics Provider supports all the [the standard values for `fit` property](/usage/nuxt-img#fit) of Nuxt image and Nuxt picture.

Syntax: `fit='__cover__'` (default value)

This will return a variant of your master image cropped to 300x300 while preserving aspect ratio.
```html
<NuxtImg
  provider="twicpics"
  src="/football.jpg"
  height=300
  width=300
/>
```

This will return a variant of your master image resized to 300x300 with distortion.
```html
<NuxtImg
  provider="twicpics"
  src="/football.jpg"
  fit="resize"
  height=300
  width=300
/>
```

This will bring your image back to a 300x600 area with respect to the ratio (1:1) using letterboxing.
```html
<NuxtImg
  provider="twicpics"
  src="/cat_1x1.jpg"
  fit="contain"
  height=600
  width=300
/>
```

The letterboxing strips are transparent areas. Feel free to select the color of your choice by using the [background](#background) property.
```html
<NuxtImg
  provider="twicpics"
  src="/cat_1x1.jpg"
  fit="contain"
  height=600
  width=300
  background: "red"
/>
```
### format

Specifies the output format. It can be an image format or a preview format. By default, [TwicPics](https://www.twicpics.com/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider) will "guess" the best output format for the requesting browser, but you can use `format` to change this behavior.

Syntax: `format='avif'|'heif'|'jpeg'|'png'|__'webp'__`

[WebP](https://en.wikipedia.org/wiki/WebP) is the default format provided by [TwicPics](https://www.twicpics.com/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider) (if the browser supports it).

Examples:

This will return a variant of your image in `avif` format.
```html
<NuxtImg
  provider="twicpics"
  src="/cat_1x1.jpg"
  format="avif"
/>
```

This will return a blurry preview of your image in `svg` format.
```html
<NuxtImg
  provider="twicpics"
  src="/cat_1x1.jpg"
  format="preview"
/>
```

More informations [about format here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#output).

### quality

Specifies the output quality as a number between 1 (poor quality) and 100 (best quality).

Syntax: `quality=`[`number`](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#number)

[TwicPics](https://www.twicpics.com/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider) considers `quality`=70 as default value.

__NB__: TwicPics automatically manages the returned quality according to the network performance for an optimized display speed even in difficult conditions.

__NB__ : when Data Saver is activated (android mobile only), default `quality`=10.

Example:

```html
<NuxtImg
  provider="twicpics"
  src="/cat_1x1.jpg"
  quality=1
/>
```

More informations [about quality here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=quality#truecolor).

### background

`background` specifies a color that will show through transparent and translucent parts of the image. This will have no effect on images with no transparency nor translucency.

Syntax: `background=`[`color`](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#color)

Example:

```html
<NuxtImg
  provider="twicpics"
  src="/icon-500.png"
  background="red"
/>
```

```html
<NuxtImg
  provider="twicpics"
  src="/cat_1x1.jpg"
  fit="contain"
  height=600
  width=300
  background: 'red'
/>
```

More informations [about background here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#background).

## TwicPics modifiers

In addition to the standard parameters, the specific features of the TwicPics API are accessible via the `modifiers` prop of `nuxt-img` or `nuxt-picture`.

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  ...
  standard props
  ...
  :modifiers="{key_1: value_1, ..., key_n: value_n}"
/>
```

[A complete list of these features and their uses is accessible here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider).

### crop

`crop` will extract a zone from the image which size is the given `crop` size. If no coordinates are given, the focus point will be used as a guide to determine where to start the extraction. If coordinates are given, they will be used to determine the top-left pixel from which to start the extraction and the focus point will be reset to the center of the resulting image.

Syntax: `{ crop: `[`size`](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#crop-size)[`@coordinates`](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#coordinates)` }`

```html
<NuxtImg
  provider="twicpics"
  src="/cat.jpg"
  :modifiers="{crop:'500x100'}" <!-- no coordinates given -->
/>
<NuxtImg
  provider="twicpics"
  src="/cat.jpg"
  :modifiers="{crop:'500x100@700x400'}" <!-- passing coordinates -->
/>
<NuxtImg
  provider="twicpics"
  src="/cat.jpg"
  :modifiers="{focus:'auto', crop:'500x100'}" <!-- using focus auto -->
/>
```

More informations [about `crop` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#crop).

### flip

`flip` will invert the image horizontally, vertically or both depending on the expression provided.

Syntax: `{ flip: 'both' | 'x' | 'y' }`

```html
<NuxtImg
  provider="twicpics"
  src="/puppy.jpg"
  :modifiers="{flip:'both'}" <!-- horizontal and vertical -->
/>
<NuxtImg
  provider="twicpics"
  src="/puppy.jpg"
  :modifiers="{flip:'x'}" <!-- horizontal -->
/>
<NuxtImg
  provider="twicpics"
  src="/puppy.jpg"
  :modifiers="{flip:'y'}" <!-- vertical -->
/>
```

More informations [about `flip` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#flip).

### focus

`focus` will set the focus point coordinates. It doesn't modify the output image in any way but will change the behavior of further transformations that take the focus point into account (namely cover, crop and resize).

If `auto` is used in place of actual coordinates, the focus point will be chosen automagically for you!

Syntax: `{ focus: `[`coordinates`](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#crop-coordinates)`|'auto' }`

```html
<NuxtImg
  provider="twicpics"
  src="/cat_1x1.jpg"
  :modifiers="{focus:'auto', crop:'500x500'}" <!-- using crop with focus auto -->
/>

<NuxtImg
  provider="twicpics"
  src="/football.jpg"
  :modifiers="{focus:'auto', cover:'1:1'}" <!-- changing ratio with focus auto -->
/>

<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{focus:'200x200', cover:'1:1'}" <!-- changing ratio with selected focus -->
/>
```

_NB_ : focus must be placed before the transformations modifying the output image (namely cover, crop and resize).

More informations [about `focus` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#focus).

### truecolor

`truecolor` can be used to prevent color quantization. If no boolean is provided, true is assumed.

By default, quantization is allowed (truecolor=false).

Quantization occurs whenever the output format is `png`.

Use truecolor if you want to distribute substantially larger but more accurate images with translucency to users on browsers with no `WebP` support or when `png` is required as output format.

```html
<NuxtImg
  provider="twicpics"
  src="/peacock.jpg"
  format="png"
  :modifiers="{truecolor:true}" <!-- disallowes color quantization -->
/>

<NuxtImg
  provider="twicpics"
  src="/peacock.jpg"
  format="png"
  :modifiers="{truecolor:false}" <!-- allowes color quantization (default value) -->
/>
```

More informations [about `truecolor` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#truecolor).

### turn

`turn` will change the orientation of the image. It accepts an angle in degrees or an expression. Angles will be rounded to the closest multiple of 90°.

Syntax: `{ turn: `[`number`](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#number)` | 'flip' | 'left' | 'right' }`

```html
<NuxtImg
  provider="twicpics"
  src="/football.jpg"
  :modifiers="{turn:'left'}" <!-- turns image at -90° -->
/>

<NuxtImg
  provider="twicpics"
  src="/football.jpg"
  :modifiers="{turn:180}" <!-- turns image at 180° -->
/>
```

More informations [about `turn` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#turn).

### zoom

Zooms into the image by a factor equal or superior to 1 towards the focus point while preserving the image size.

Syntax: `{ zoom: `[`number`](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#number)` }`

```html
<NuxtImg
  provider="twicpics"
  src="/cherry-3.jpg"
  :modifiers="{zoom:1.5}" <!-- zooms into image by a factor 1.5 -->
/>

<NuxtImg
  provider="twicpics"
  src="/cherry-3.jpg"
 :modifiers="{zoom:3}" <!-- zooms into image by a factor 3 -->
/>

<NuxtImg
  provider="twicpics"
  src="/cherry-3.jpg"
 :modifiers="{focus:'auto', zoom:3}" <!-- zooms into image by a factor 3 in direction of the focus-->
/>

<NuxtImg
  provider="twicpics"
  src="/cherry-3.jpg"
 :modifiers="{focus:'200x200', zoom:3}" <!-- zooms into image by a factor 3 in direction of the focus-->
/>

```

More informations [about `zoom` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#zoom).

## Combination of parameters

You can combine several transformations of the [TwicPics API](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider).

Be aware that the order of the parameters can be significant.

Example:

This will return a variant of image for which we have, in order:
1. cropped the image from the center to 16:9 aspect ratio
2. then placed the focus on the center of interest of the cropped image
3. then rotate the image 90° to the left

The result is a 9:16 (not 16:9) image with a possibly false area of interest.
```html
<NuxtImg
  provider="twicpics"
  src="/football.jpg"
  :modifiers="{cover:'16:9', focus:'auto', turn:'left'}"
/>
```

This will return a variant of your image for which we have, in order:
1. placed the focus on the center of interest of the original image
2. then cropped the image to 16:9 from the center of interest
3. then rotated the image 90° to the left

The result is a cropped image with the area of interest retained and displayed in 16:9 format.
```html
<NuxtImg
  provider="twicpics"
  src="/football.jpg"
  fit="fill"
  :modifiers="{focus:'auto', turn:'left', cover:'16:9'}"
/>
```

## Dealing with image ratio

Let's say you want to display an image in 4:3 aspect ratio with a width of 300px.

```html
<NuxtImg
  provider="twicpics"
  src="/cat_1x1.jpg"
  width=300
  fit="fill"
  :modifiers="{cover:'4:3'}"
/>
```

Or, with `focus`='auto'

```html
<NuxtImg
  provider="twicpics"
  src="/cat_1x1.jpg"
  width=300
  fit="fill"
  :modifiers="{focus:'auto', cover:'4:3'}"
/>
```

## Go further with TwicPics

TwicPics offers a [collection of web components](https://www.npmjs.com/package/@twicpics/components) that will allow you to exploit all its power :

- Pixel Perfect
- Layout Driven
- Ideal Compression
- Lazy Loading
- LQIP
- CLS Optimization

A specific integration to Nuxt is available [here](https://github.com/TwicPics/components/blob/main/documentation/nuxt2.md).
