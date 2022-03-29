---
title: Twicpics Provider
description: 'Nuxt Image internally use Twicpics as static provider.'
navigation:
  title: Twicpics
---

Integration between [Twicpics](https://www.twicpics.com/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider) and the image module.

## What is TwicPics?

[Twicpics](https://www.twicpics.com/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider) is a Responsive Image Service Solution (SaaS) that enables on-demand responsive image generation.

Using the TwicPics Provider, you can, out of the box, benefit from at least :
- the performance of our network: global CDN, optimized protocols and competitive caching
- the ideal compression: modern technology and preservation of the visual quality (TwicPics delivers `WebP` natively for accounting browsers)


## Requirement

The only requirement is to have a TwicPics account. 
If you don't already have one, you can easily [create your own TwicPics account for free](https://account.twicpics.com/signup).

## Setup

You just need to configure the `twicpics` provider with the `baseURL` set to your TwicPics domain.

```js{}[nuxt.config.js]
export default {
  image: {
    twicpics: {
      // baseURL is https://<your-domain>.twic.pics
      // just replace <your-domain> with your TwicPics domain value
      baseURL: 'https://nuxt-demo.twic.pics'
    }
  }
}
```

## Standard properties

TwicPics Provider complies with the documentation of [nuxt-img](https://image.nuxtjs.org/components/nuxt-img) and [nuxt-picture](https://image.nuxtjs.org/components/nuxt-picture).

### background

`background` specifies a color that will show through transparent and translucent parts of the image. This will have no effect on images with no transparency nor translucency.

Syntax: background=[color](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#color)

Example:

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.png"
  background="red"
/>
```

More informations [about background here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#background).

### fit

`fit` determines how the image is resized in relation to the parameters `height` and `width`.

See the different possible values [here](https://image.nuxtjs.org/components/nuxt-img/#fit).

Syntax: fit='__cover__' (default value)

Example: here, path-to-nuxt-demo.png is a landscape image 

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.png"
  height=300
  width=300
/>
```

This will return a variant of your `path-to-nuxt-demo.jpg` cropped to 300x300 without any distortion.

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.png"
  fit='resize'
  height=300
  width=300
/>
```

This will return a variant of your `path-to-nuxt-demo.jpg` resized to 300x300 with distortion.

[We suggest using the TwicPics API for the other resizing modes (contain, inside and ouside)](#twicpics-best-practices).

### format

Specifies the output format. It can be an image format or a preview format. By default, [Twicpics](https://www.twicpics.com/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider) will "guess" the best output format for the requesting browser, but you can use `format` to change this behavior.

Syntax: format='avif'|'heif'|'jpeg'|'png'|__'webp'__

[WebP](https://en.wikipedia.org/wiki/WebP) is the default format provided by [Twicpics](https://www.twicpics.com/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider) (if the browser supports it).

Examples:

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  format="avif"
/>
```
This will return a variant of your `path-to-nuxt-demo.jpg` file in `avif` format.

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  format="preview"
/>
```
This will return a blurry preview of your `path-to-nuxt-demo.jpg` file in `svg` format.

More informations [about format here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#output).

### quality

Specifies the output quality as a number between 1 (poor quality) and 100 (best quality).

Syntax:  quality=[number](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#number)

[Twicpics](https://www.twicpics.com/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider) considers `quality`=70 as default value.

__NB__ : when Data Saver is activated (android mobile only), default `quality`=10. 

Example:

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  quality=1
/>
``` 

More informations [about quality here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=quality#truecolor).

## Twicpics modifiers

In addition to the standard parameters, the specific features of the TwicPics API are accessible via the `modifiers` prop of `nuxt-img` or `nuxt-picture`. 

```html
<nuxt-img
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  ...
  standard props
  ...
  :modifiers="{key_1: value_1, ..., key_n: value_n}"
/>
```

[A complete list of these features and their uses is accessible here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider).

### contain

`contain` behaves like the CSS background size "contain". It will resize the image so that it completely fits inside the target area while conserving the original aspect ratio. The resulting image will be smaller than a target size which aspect ratio is not the same as the aspect ratio of the input.

Syntax: { contain: [size](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#size) }

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{contain:'200x500'}"
/>
```

More informations [about `contain` here](https://www.twicpics.com/docs/api/transformations#contain/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider).

### contain-max

A conditional version of contain that will be applied only when one of the given lengths is smaller than the corresponding input image dimension.

Syntax: { 'contain-max': [size](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#size) }

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{'contain-max':'200x500'}"
/>
```

More informations [about `contain-max` here](https://www.twicpics.com/docs/api/transformations#contain-max/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider).

### contain-min

A conditional version of contain that will be applied only when one of the given lengths is larger than the corresponding input image dimension.

Syntax: { 'contain-min': [size](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#size) }

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{'contain-min':'200x500'}"
/>
```

More informations [about `contain-max` here](https://www.twicpics.com/docs/api/transformations#contain-min/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider).

### cover

`cover` behaves like the CSS background size "cover". It will resize the image so that it completely fills the target area while conserving the original aspect ratio. If some parts of the image end up outside of the covered area, they are cropped.

Syntax: { cover: [size](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#size)|[ratio](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#ratio) }

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{cover:'200x500'}" <!-- passing size to cover -->
/>

<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{cover:'4:3'}"  <!-- passing size to cover -->
/>
```

More informations [about `cover` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#cover).

### cover-max

A conditional version of cover that will be applied only when one of the given lengths is smaller than the corresponding input image dimension.

Syntax: { 'cover-max': [size](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#size)}

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{'cover-max':'200x500'}"
/>
```

More informations [about `cover-max` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#cover-max).

### cover-min

A conditional version of cover that will be applied only when one of the given lengths is larger than the corresponding input image dimension.

Syntax: { 'cover-min': [size](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#size)}

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{'cover-min':'200x500'}"
/>
```

More informations [about `cover-min` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#cover-min).

### crop

`crop` will extract a zone from the image which size is the given `crop` size. If no coordinates are given, the focus point will be used as a guide to determine where to start the extraction. If coordinates are given, they will be used to determine the top-left pixel from which to start the extraction and the focus point will be reset to the center of the resulting image.

Syntax: { crop: [size](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#crop-size)[@coordinates](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#coordinates) }

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{crop:'500x200'}" <!-- no coordonates given -->
/>
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{crop:'500x200@700x400'}" <!-- passing coordonates -->
/>
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{focus:'auto', crop:'500x200'}" <!-- using focus auto -->
/>
```

More informations [about `crop` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#crop).

### flip

`flip` will invert the image horizontally, vertically or both depending on the expression provided.

Syntax: { flip: 'both'|'x'|'y' }

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{flip:'both'}" <!-- horizontal and vertical -->
/>
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{flip:'x'}" <!-- horizontal -->
/>
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{flip:'y'}" <!-- vertical -->
/>
```

More informations [about `flip` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#flip).

### focus

`focus` will set the focus point coordinates. It doesn't modify the output image in any way but will change the behavior of further transformations that take the focus point into account (namely cover, crop and resize).

If `auto` is used in place of actual coordinates, the focus point will be chosen automagically for you! 

Syntax: { focus: [coordinates](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#crop-coordinates)|'auto' }

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{focus:'auto', crop:'500x200'}" <!-- using crop with focus auto -->
/>

<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{focus:'auto', cover:'1:1'}" <!-- using crop with focus auto -->
/>

<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{focus:'200x200', cover:'1:1'}" <!-- using crop with selected focus -->
/>
```

_NB_ : focus must be placed before the transformations modifying the output image (namely cover, crop and resize).

More informations [about `focus` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#focus).

### output

Used as [format props](#format) in `nuxt-img` and `nuxt-figure`.

More informations [about `output` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#output).

### resize

`resize` will resize the image to the specified size. If only one length is provided, the other dimension will be determined so as to respect the aspect ratio of the input image. If both lengths are provided, the aspect ratio may not be respected.

Syntax: { resize: [size](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#size)|[ratio](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#ratio) }

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{resize:'200'}" <!-- resizes x to 200px and y in respect with the aspect ratio of the input image  -->
/>

<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{resize:'-x200'}" <!-- resizes y to 200px and x in respect with the aspect ratio of the input image  -->
/>

<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{resize:'200x200'}" <!-- resizes both x and y to 200px (the aspect ratio may not be respected) -->
/>

<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{resize:'4:3'}" <!-- using ratio (the aspect ratio may not be respected) -->
/>
```

More informations [about `resize` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#resize).

### truecolor

`truecolor` can be used to prevent color quantization. If no boolean is provided, true is assumed.

By default, quantization is allowed (truecolor=false).

Quantization occurs whenever the output format is `png`.

Use truecolor if you want to distribute substantially larger but more accurate images with translucency to users on browsers with no `WebP` support or when `png` is required as output format.

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  format='png' 
  :modifiers="{truecolor:true}" <!-- disallowes color quantization -->
/>

<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  format='png'
  :modifiers="{truecolor:false}" <!-- allowes color quantization (default value) -->
/>
```

More informations [about `truecolor` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#truecolor).

### turn

`turn` will change the orientation of the image. It accepts an angle in degrees or an expression. Angles will be rounded to the closest multiple of 90°.

Syntax: { turn: [number](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#number)|'flip'|'left'|'right' }

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{turn:'left'}" <!-- turns image at -90° -->
/>

<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{turn:182}" <!-- turns image at 180° -->
/>
```

More informations [about `turn` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#turn).

### zoom

Zooms into the image by a factor equal or superior to 1 towards the focus point while preserving the image size.

Syntax: { zoom: [number](https://www.twicpics.com/docs/api/manipulations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#number) }

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{zoom:1.5}" <!-- zooms into image by a factor 1.5 -->
/>

<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
 :modifiers="{zoom:3}" <!-- zooms into image by a factor 3 -->
/>

<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
 :modifiers="{focus:'auto', zoom:3}" <!-- zooms into image by a factor 3 in direction of the focus-->
/>

<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
 :modifiers="{focus:'200x200', zoom:3}" <!-- zooms into image by a factor 3 in direction of the focus-->
/>

```

More informations [about `zoom` here](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider#zoom).

## Combination of parameters 

You can combine several transformations of the [TwicPics API](https://www.twicpics.com/docs/api/transformations/?utm_source=nuxt&utm_medium=organic&utm_campaign=provider).

Be aware that the order of the parameters can be significant.

Example:

```html
<nuxt-img
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{cover:'16:9', focus:'auto', turn:'left'}"
/>
```

This will return a variant of your `path-to-nuxt-demo.jpg` file in which we have, in order:
1. cropped the image from the center to 16:9 aspect ratio
2. then placed the focus on the center of interest of the cropped image
3. then rotate the image 90° to the left

The result is a 9:16 (not 16:9) image with a possibly false area of interest.

```html
<nuxt-img
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  fit="fill"
  :modifiers="{focus:'auto', turn:'left', cover:'16:9'}"
/>
```

This will return a variant of your `path-to-nuxt-demo.jpg` file in which we have, in order:
1. placed the focus on the center of interest of the original image
2. then cropped the image to 16:9 from the center of interest
3. then rotated the image 90° to the left

The result is a cropped image with the area of interest retained and displayed in 16:9 format.

## Twicpics best practices

### Dealing with image ratio

Let's say you want to display an image in 4:3 aspect ratio with a width of 300px.

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  width=300
  fit="resize"
  :modifiers="{cover:'4:3'}"
/>
```

Or, with `focus`='auto'

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  width=300
  fit="resize"
  :modifiers="{focus:'auto', cover:'4:3'}"
/>
```

### Resizing according to content

Let's say path-to-nuxt-demo.jpg is a 1000x1000 image.

You want to display it, without cropping, in a 200x300 area.

```html
<NuxtImg
  provider="twicpics"
  src="/path-to-nuxt-demo.jpg"
  :modifiers="{ contain:'200x300' }"
/>
```

It will resize the image so that it completely fits inside the target area (200x300) while conserving the original aspect ratio (1:1). The result is an 200x200 image.

## Go further with TwicPics

If you want to learn more about `TwicPics` and its integration with `Nuxt`, please visit [our documentation](https://github.com/TwicPics/components/blob/main/documentation/nuxt2.md).