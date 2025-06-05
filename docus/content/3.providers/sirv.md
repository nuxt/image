---
title: Sirv
description: Nuxt Image integration with Sirv media management, transformation and delivery platform.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/sirv.ts
    size: xs
---

Integration between [Sirv](https://sirv.com) and Nuxt image.

To use Sirv provider, you need to set up your Sirv URL as the baseURL in the Nuxt Image module configuration, like this:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    sirv: {
      baseURL: 'https://youralias.sirv.com'
    }
  }
})
```

> Get your alias from your [Sirv account details page](https://my.sirv.com/#/account/settings) or set up a custom domain ([instructions](https://sirv.com/help/articles/multiple-domains)).

## Sirv `fit` parameters

By default, Sirv will scale the image, preserving its aspect ratio, to fit within the smallest dimension.
Here's the map of standard values for the [fit](/usage/nuxt-img#fit) property and how they're going to be interpreted by Sirv:

- `fill`: `ignore`
- `inside`: `fill`
- `outside`: `fill`
- `noUpscaling`: `noup`, this is the default option for Sirv image provider, so you don't need to specify it explicitly.

## `format`

If no format is specified, Sirv will deliver your images in the [optimal](https://sirv.com/help/articles/dynamic-imaging/#optimal) format by default.
Alternatively, you can specify a custom format for the image like this:

```vue
<NuxtImg
  provider="sirv"
  src="/example-image.jpg"
  width="300"
  format="webp"
/>
```

## Sirv Modifiers

To use Sirv-specific transformations, add them in the `modifier` prop.

### `profile`

Use [Sirv profiles](https://sirv.com/help/profiles) to combine multiple transformation options into a single parameter.
For example, you can combine `canvas`, `crop` and `watermark` parameters into a single profile and use it like this:

```vue
<NuxtImg
  provider="sirv"
  src="/example-image.jpg"
  width="300"
  :modifiers="{ profile: 'my-profile' }"
/>
```

### `canvas`

Use the `canvas` modifier to add a canvas around your image. You can also set its width, height, color, and position.

### `sharpen`

Sharpen the image using the `sharpen` modifier.

```vue
<NuxtImg
  provider="sirv"
  src="/example-image.jpg"
  width="300"
  :modifiers="{ sharpen: 50 }"
/>
```

### `frame`

Add a frame/border to your images using the `frame` modifier. You can also set its width and color.

```vue
<NuxtImg
  provider="sirv"
  src="/example-image.jpg"
  width="300"
  :modifiers="{
    frameStyle: 'solid',
    frameColor: '00000',
    frameWidth: '2',
    frameRimColor: '97A6B1',
    frameRimWidth: '2'
  }"
/>
```

### `rotate`

Use the `rotate` modifier to rotate your image. You can specify the number of degrees to rotate the image by.

```vue
<NuxtImg
  provider="sirv"
  src="/example-image.jpg"
  :modifiers="{ rotate: 90 }"
/>
```

### Color and light options

Sirv has various [color manipulation options](https://sirv.com/help/articles/dynamic-imaging/color) like `grayscale`, `colorize`,`colortone`,`colorLevels`, as well as [light manipulation options](https://sirv.com/help/articles/dynamic-imaging/light) like `lightness`,
`hue`, `saturation`, `highlights`, `shadows`, `brightness`, `exposure`, `contrast`.

Here's how to convert an image to grayscale:

```vue
<NuxtImg
  provider="sirv"
  src="/example-image.jpg"
  width="300"
  :modifiers="{ grayscale: true }"
/>
```

### Watermarks and text overlays

Using Sirv's Nuxt Image integration, you can overlay images or text over other images for watermarking or creating a dynamic banner using custom text!

#### `watermark`

Add an image overlay over your existing image using the `watermark` modifier. Used mostly for watermarking, but can be useful for creating banners, OG images, and personalization. Here's an example of a single watermark:

```vue
<NuxtImg
  provider="sirv"
  src="example-image.jpg"
  width="300"
  :modifiers="{
    watermark: '/watermark-v1.png',
    watermarkPosition: 'center',
    watermarkWidth: '30%'
  }"
/>
```

Find out more about Sirv watermarks [here](https://sirv.com/help/articles/dynamic-imaging/watermark).

#### Overlay Text

You can add text overlays to your images and have full freedom over their positioning and looks.

```vue
<NuxtImg
  provider="sirv"
  src="example-image.jpg"
  width="300"
  :modifiers="{
    text: 'Hello there',
    textAlign: 'center',
    textPositionGravity: 'south',
    textBackgroundColor: '#ffff',
    textSize: 60,
    textFontFamily: 'Arial',
    textColor: 'white'
  }"
/>
```

More examples of text overlays can be found [here](https://sirv.com/help/articles/dynamic-imaging/text).

## List of supported transformations

Sirv's Nuxt Image integration uses intuitive names for each transformation. If you use a property that does not match any of the following supported options, it will be added in the URL as it is.

| Supported Parameter Name | Translates to Parameter    | Description                                                                                           |
| ------------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------- |
| width                    | w                          | Width of image.                                                                                       |
| height                   | h                          | Height of image.                                                                                      |
| s                        | s                          | Resize the image by its biggest side                                                                  |
| quality                  | q                          | JPEG image quality (percentage).                                                                      |
| fit                      | scale.option               | Image scaling options.                                                                                |
| profile                  | profile                    | Apply a Sirv [profile](https://sirv.com/help/articles/dynamic-imaging/profiles)                      |
| format                   | format                     | Image format served (defaults to [optimal](https://sirv.com/help/articles/dynamic-imaging/#optimal)). |
| webpFallback             | webp-fallback              | Image format for browsers without WebP support.                                                       |
| subsampling              | subsampling                | Chroma subsampling to reduce JPEG file size.                                                          |
| gifCompression           | gif.lossy                  | Apply lossy compression, to reduce GIF file size.                                                     |
| crop                     | crop.type                  | Automatically crop to edge of image contents; point of interest; or face.                             |
| cropAr                   | crop.aspectratio           | Aspect ratio of the crop                                                                              |
| cw                       | cw                         | Crop the image to a specific width.                                                                   |
| ch                       | ch                         | Crop the image to a specific height.                                                                  |
| cx                       | cx                         | Position to start image crop (from top).                                                              |
| cy                       | cy                         | Position to start image crop (from left).                                                             |
| cropPaddingX             | crop.pad.x                 | Add padding to left/right of crop area                                                                |
| cropPaddingY             | crop.pad.y                 | Add padding to top/bottom of crop area.                                                               |
| canvasHeight             | canvas.height              | Create a canvas around the image (height).                                                            |
| canvasWidth              | canvas.width               | Create a canvas around the image (width).                                                             |
| canvasAr                 | canvas.aspectratio         | Aspect ratio of the canvas from 1-99 e.g. 16:9                                                        |
| canvasPosition           | canvas.position            | Position of the canvas behind the image.                                                              |
| canvasBorderWidth        | canvas.border.width        | Adds additional width left and right of the canvas.                                                   |
| canvasBorderHeight       | canvas.border.height       | Adds additional height above and below the canvas.                                                    |
| canvasBorderColor        | canvas.border.color        | Color of the canvas border e.g. E0AA80 or red.                                                        |
| canvasBorderOpacity      | canvas.border.opacity      | Opacity of the canvas border.                                                                         |
| watermark                | watermark                  | Filepath of the image to be overlayed.                                                                |
| watermarkPosition        | watermark.position         | Position of the watermark on the image.                                                               |
| watermarkPositionGravity | watermark.position.gravity | sets the starting point for shifting the x & y values.                                                |
| watermarkPositionX       | watermark.position.x       | Position of the watermark (from left).                                                                |
| watermarkPositionY       | watermark.position.y       | Position of the watermark (from top).                                                                 |
| watermarkWidth           | watermark.scale.width      | Width of watermark.                                                                                   |
| watermarkHeight          | watermark.scale.height     | Height of watermark.                                                                                  |
| text                     | text                       | Display text on your image.                                                                           |
| textBase64               | text.text64                | Alternative to text parameter, with Base64 encoding                                                   |
| textSize                 | text.size                  | Width of text area in relation to image.                                                              |
| textAlign                | text.align                 | Align the multiline text.                                                                             |
| textPosition             | text.position              | Location of the text on the image.                                                                    |
| textPositionX            | text.position.x            | Location of the text (from left).                                                                     |
| textPositionY            | text.position.y            | Location of the text (from top).                                                                      |
| textPositionGravity      | text.position.gravity      | Master location of the text on the image.                                                             |
| textFontSize             | text.font.size             | Fix the size of the text in px.                                                                       |
| textFontStyle            | text.font.style            | Style of the text.                                                                                    |
| textFontFamily           | text.font.family           | Choose a font e.g. 'Open Sans'.                                                                       |
| textFontWeight           | text.font.weight           | Choose font weight (light, normal, semi-bold, bold, extra-bold).                                      |
| textColor                | text.color                 | Text color e.g. E0AA80 or E0AA8020.                                                                   |
| textOpacity              | text.opacity               | Text opacity.                                                                                         |
| textOutlineWidth         | text.outline.width         | Add an outline around the text.                                                                       |
| textoutlineColor         | text.outline.color         | Color of the text outline.                                                                            |
| textOutlineOpacity       | text.outline.opacity       | Opacity of the text outline.                                                                          |
| textOutlineBlur          | text.outline.blur          | Blur the edge of the text outline.                                                                    |
| textBackgroundColor      | text.background.color      | Background color e.g. E0AA80 or E0AA8020.                                                             |
| textBackgroundOpacity    | text.background.opacity    | Background opacity.                                                                                   |
| sharpen                  | sharpen                    | Sharpen the image.                                                                                    |
| blur                     | blur                       | Blur the image.                                                                                       |
| grayscale                | grayscale                  | Make the image black & white.                                                                         |
| colorize                 | colorize                   | Overlay a color on the image.                                                                         |
| colorizeColor            | colorize.color             | The color of the colorize option.                                                                     |
| colorizeOpacity          | colorize.opacity           | Opacity of the color overlay.                                                                         |
| colortone                | colortone                  | Change the color tone of the image.                                                                   |
| colortoneColor           | colortone.color            | Apply a color tone to an image.                                                                       |
| colortoneLevel           | colortone.level            | Set the level of blending with the original image.                                                    |
| colortoneMode            | colortone.mode             | Apply the color tone to the entire image or shadows/highlights only.                                  |
| vignette                 | vigette.value              | Adjust the depth of the vignette.                                                                     |
| vignetteColor            | vigette.color              | Add a vignette (dark edges) around the image.                                                         |
| lightness                | lightness                  | Change the lightness of the image.                                                                    |
| colorlevelBlack          | colorlevel.black           | Adjust black level of image.                                                                          |
| colorlevelWhite          | colorlevel.white           | Adjust white level of image.                                                                          |
| histogram                | histogram                  | Display a histogram of RGB levels.                                                                    |
| hue                      | hue                        | Change the hue of the image.                                                                          |
| saturation               | saturation                 | Change the saturation of the image.                                                                   |
| highlights               | highlights                 | Change the highlights of the image.                                                                   |
| shadows                  | shadows                    | Change the shadows of the image.                                                                      |
| brightness               | brightness                 | Change the brightness of the image.                                                                   |
| exposure                 | exposure                   | Change the exposure of the image.                                                                     |
| contrast                 | contrast                   | Change the contrast of the image.                                                                     |
| rotate                   | rotate                     | Number of degrees to rotate the image.                                                                |
| flip                     | flip                       | Flip image vertically (mirror).                                                                       |
| flop                     | flop                       | Flip image horizontally (mirror).                                                                     |
| opacity                  | opacity                    | Opacity of PNG images.                                                                                |
| frameStyle               | frame.style                | Add a frame around the image.                                                                         |
| frameColor               | frame.color                | Frame color e.g. E0AA80 or E0AA8020.                                                                  |
| frameWidth               | frame.width                | Frame width.                                                                                          |
| frameRimColor            | frame.rim.color            | Frame rim color e.g. E0AA80 or E0AA8020.                                                              |
| frameRimWidth            | frame.rim.width            | Frame rim width.                                                                                      |
| pdfPage                  | page                       | Page number of PDF when converted to image.                                                           |

> Learn more about [Sirv's Image transformations](https://sirv.com/help/article/dynamic-imaging) from the official documentation.
