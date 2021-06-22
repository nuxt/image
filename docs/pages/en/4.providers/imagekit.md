---
title: ImageKit Provider
description: "Nuxt Image has first class integration with ImageKit"
navigation:
  title: ImageKit
---

Integration between [ImageKit](https://docs.imagekit.io/) and the image module.

To use the ImageKit provider, you need to set your ImageKit account URL-endpoint as the base url like below. 

```js{}[nuxt.config.js]
export default {
  image: {
    imagekit: {
      baseURL: 'https://ik.imagekit.io/your_imagekit_id'
    }
  }
}
```

> You can get [URL-endpoint](https://docs.imagekit.io/integration/url-endpoints#default-url-endpoint) from your ImageKit dashboard - [https://imagekit.io/dashboard#url-endpoints](https://imagekit.io/dashboard#url-endpoints).

## ImageKit `fit` Parameters

In addition to the standard [`fit`](/components/nuxt-img#fit) properties of Nuxt Image and Nuxt Picture, ImageKit offers more cropping and resizing options to the users:

* `extract` - The output image has its height, width as requested, and the aspect ratio is preserved. Unlike the `cover` parameter, we extract out a region of the requested dimension from the original image.
* `pad_extract` - This parameter is similar to `extract`. This comes in handy in scenarios where we want to extract an image of a larger dimension from a smaller image. So, the `pad_extract` mode adds solid colored padding around the image to match the exact size requested.

Read ImageKit [crop and crop mode documentation](https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#crop-crop-modes-and-focus) for more details and examples of how it works.

## ImageKit Modifiers

On top of the standard [Nuxt Image modifiers](/components/nuxt-img#modifiers), a user can also leverage ImageKit-specific transformation parameters provided in the `modifier` prop.

### `focus`

This parameter can be used along with resizing and cropping to focus on the desired part of the image. You can use focus parameter values like `left`, `right`, `top`, `bottom`, `center`, `top`, `left`, `bottom`, `right`, `top_left`, `top_right`, `bottom_left` and `bottom_right`.

Custom coordinates can also be used to focus using parameter value `custom`. Learn more from [example](https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#example-focus-using-custom-coordinates).

Moreover, ImageKit also provides smart cropping that can automatically detect the most important part of the image using `auto`. And, `face` can be used to find a face (or multiple faces) in an image and focus on that.

Check out ImageKit's documentation on [focus](https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#focus-fo) to learn more.


### `blur`

This can be used to blur an image. Use modifier `blur` to specify the Gaussian Blur radius that is to be applied to the image. Possible values include integers between `1` to `100`.

```html
<nuxt-img
  provider="imagekit"
  src="/default-image.jpg"
  :modifiers="{blur: 10}"
/>
```


### `effectGray`

Turn your image to a grayscale version using the `effectGray` modifier.

```html
<nuxt-img
  provider="imagekit"
  src="/default-image.jpg"
  height="300"
  :modifiers="{effectGray: true}"
/>
```


### `named`

Use [named transformations](https://docs.imagekit.io/features/named-transformations) as an alias for an entire transformation string.

For example, we can create a named transformation - `media_library_thumbnail` for a transformation string - `tr:w-100,h-100,c-at_max,fo-auto`.


### `border`

Add a border to your images using the `border` modifier. You can also set its width and color.

```html
<nuxt-img
  provider="imagekit"
  src="/default-image.jpg"
  width="300"
  :modifiers="{border: '20_FF0000'}"
/>
```


### `rotate`

Use the `rotate` modifier to rotate your image. Possible values are - `0`, `90`, `180`, `270`, `360`, and `auto`.

```html
<nuxt-img
  provider="imagekit"
  src="/default-image.jpg"
  :modifiers="{rotate: 90}"
/>
```


### `radius`

Give rounded corners to your image using `radius`. Possible values are - positive integers and `max`.

```html
<nuxt-img
  provider="imagekit"
  src="/default-image.jpg"
  :modifiers="{radius: 20}"
/>
```


### `bg`

Specify background color and its opacity for your image using the `bg` modifier. 

```html
<nuxt-img
  provider="imagekit"
  src="/default-image.jpg"
  height="1200"
  width="1200"
  fit="pad_extract"
  :modifiers="{bg: '272B38'}"
/>
```

> Read more about ImageKit crop, resize, and other common transformations [here](https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations).

## Overlay Transformation Modifiers
Using ImageKit's Nuxt Image integration, you can overlay images or text over other images for watermarking or creating a dynamic banner using custom text!

### `overlayImage`

Overlay an image on top of another image (base image) using the `overlayImage` modifier. You can use this to create dynamic banners, watermarking, etc.

```html
<nuxt-img
  provider="imagekit"
  src="/default-image.jpg"
  :modifiers="modifiers"
  />

<script>
  export default {
    data() {
      return {
        modifiers: {
          overlayImage: 'default-image.jpg',
          overlaywidth: 300,
          overlayHeight: 200,
          overlayFocus: 'top_left',
          overlayImageBorder: '5_FFFFFF',
        }
      }
    }
  }
</script>
```

### Overlay Text

You can overlay text on an image and apply various transformations to it as per your needs.

```html
<nuxt-img
  provider="imagekit"
  src="/default-image.jpg"
  :modifiers="modifiers"
/>

<script>
  export default {
    data() {
      return {
        modifiers: {
          overlayText: 'overlay made easy',
          overlayRadius: 30,
          overlayTextBackground: 'FFFFFF80',
          overlayTextFontSize: '45',
          overlayTextColor: '000000',
          overlayTextPadding: '40'
        }
      }
    }
  }
</script>
```

Read more about ImageKit's overlay transformation parameters [here](https://docs.imagekit.io/features/image-transformations/overlay).

## Image Enhancement Modifiers

### `effectContrast`
Enhance contrast of an image using the `effectContrast` modifier.

```html
<nuxt-img
  provider="imagekit"
  src="/default-image.jpg"
  height="300"
  :modifiers="{effectContrast: true}"
/>
```

### `effectSharpen`
Sharpen the input image using the `effectSharpen` modifier.

```html
<nuxt-img
  provider="imagekit"
  src="/default-image.jpg"
  height="300"
  :modifiers="{effectSharpen: 10}"
/>
```

## List of supported transforms
ImageKit's Nuxt Image integration provides an easy-to-remember name for each transformation parameter. It makes your code more readable. If you use a property that does not match any of the following supported options, it will be added in the URL as it is.

| Supported Parameter Name | Translates to Parameter |
| ---                      | ---                     |
| bg | bg |
| aspectRatio | ar |
| x | x |
| y | y |
| xc | xc |
| yc | yc |
| oix | oix |
| oiy | oiy |
| oixc | oixc |
| oiyc | oiyc |
| crop | c |
| cropMode | cm |
| focus | fo |
| radius | r |
| border | b |
| rotate | rt |
| blur | bl |
| named | n |
| overlayX | ox |
| overlayY | oy |
| overlayFocus | ofo |
| overlayHeight | oh |
| overlayWidth | ow |
| overlayImage | oi |
| overlayImageTrim | oit |
| overlayImageAspectRatio | oiar |
| overlayImageBackground | oibg |
| overlayImageBorder | oib |
| overlayImageDPR | oidpr |
| overlayImageQuality | oiq |
| overlayImageCropping | oic |
| overlayImageCropMode | oicm |
| overlayText | ot |
| overlayTextFontSize | ots |
| overlayTextFontFamily | otf |
| overlayTextColor | otc |
| overlayTextTransparency | oa |
| overlayTextTypography | ott |
| overlayBackground | obg |
| overlayTextEncoded | ote |
| overlayTextWidth | otw |
| overlayTextBackground | otbg |
| overlayTextPadding | otp |
| overlayTextInnerAlignment | otia |
| overlayRadius | or |
| progressive | pr |
| lossless | lo |
| trim | t |
| metadata | md |
| colorProfile | cp |
| defaultImage | di |
| dpr | dpr |
| effectSharpen | e-sharpen |
| effectUSM | e-usm |
| effectContrast | e-contrast |
| effectGray | e-grayscale |
| original | orig |

> Learn more about [ImageKit's Image transformations](https://docs.imagekit.io/features/image-transformations) from the official documentation.
