---
title: Imgix
description: Nuxt Image has first class integration with Imgix.
---

Integration between [Imgix](https://docs.imgix.com/) and the image module.

To use this provider you just need to specify the base url of your service in Imgix.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    imgix: {
      baseURL: 'https://assets.imgix.net'
    }
  }
})
```

## imgix `fit` values

Beside [the standard values for `fit` property](/usage/nuxt-img#fit) of Nuxt image and Nuxt picture, imgix offers the following for extra resizing experience:

* `clamp` - Resizes the image to fit within the width and height dimensions without cropping or distorting the image, and the remaining space is filled with extended pixels from the edge of the image. The resulting image will match the constraining dimensions. The pixel extension is called an affine clamp, hence the value name, "clamp".

* `clip` - The default fit setting for imgix images. Resizes the image to fit within the width and height boundaries without cropping or distorting the image. The resulting image will match one of the constraining dimensions, while the other dimension is altered to maintain the same aspect ratio of the input image.

* `facearea` - Finds the area containing all faces, or a specific face in an image, and scales it to specified width and height dimensions. Can be used in conjunction with [faceindex](https://docs.imgix.com/apis/rendering/face-detection/faceindex) to identify a specific face, as well as [facepad](https://docs.imgix.com/apis/rendering/face-detection/facepad) to include additional padded area around the face to zoom out from the immediate area around the faces.

* `fillMax` - Resizes the image to fit within the requested width and height dimensions while preserving the original aspect ratio and without discarding any original image data. If the requested width or height exceeds that of the original, the original image remains the same size. The excess space is filled with a solid color or blurred version of the image. The resulting image exactly matches the requested dimensions.

## imgix modifiers

Beside the [standard modifiers](/usage/nuxt-img#modifiers), you can also pass all imgix-specific render API parameters to the `modifiers` prop.

For a full list of these modifiers and their uses, check out [imgix's image Rendering API documentation](https://docs.imgix.com/apis/rendering).

## imgix best practices

Some common best practices when using imgix, would be to include our auto parameter, which will automatically apply the best format for an image and compress the image as well.  Combine this with some top of intelligent cropping and resizing and you will have a great image!

```html
<NuxtImg
  provider="imgix"
  src="/blog/woman-hat.jpg"
  width="300"
  height="500"
  fit="cover"
  :modifiers="{ auto: 'format,compress', crop: 'faces' }"
/>
```

This will return a 300 x 500 image, which has been compressed, will display next-gen formats for a browser, and has been cropped intelligently to the face of the [woman in the hat](https://assets.imgix.net/blog/woman-hat.jpg?w=300&h=500&fit=crop&crop=faces).

## Additional Documentation

You can find additional documentation and a step-by-step tutorial in an imgix blog article titled [Using the New Nuxt Component with imgix](https://blog.imgix.com/2021/09/14/nuxt-image-component).
