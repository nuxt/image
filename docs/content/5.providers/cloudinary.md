# Cloudinary

Nuxt Image has first class integration with Cloudinary

Integration between [Cloudinary](https://cloudinary.com) and the image module.

To use this provider you just need to specify the base url of your project in cloudinary.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/<your-cloud-name>/image/upload/'
    }
  }
})
```

## Remote Images

To handle remote image data, you can either use [fetch](https://cloudinary.com/documentation/fetch_remote_images#remote_image_fetch_url) or [upload](https://cloudinary.com/documentation/fetch_remote_images#auto_upload_remote_resources).

Consult the cloudinary [documentation](https://cloudinary.com/documentation/fetch_remote_images#comparing_fetch_to_auto_upload) for the difference between the two.

### Fetch

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/<your-cloud-name>/image/fetch/'
    }
  }
})
```

```vue
<NuxtImg provider="cloudinary" src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg" width="300" height="200" />
```

Note: You will need to configure your "Allowed fetch domains" to do the above.

### Upload

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/<your-cloud-name>/image/upload/<mapping-folder>'
    }
  }
})
```

```vue
<NuxtImg provider="cloudinary" src="/commons/a/ae/Olympic_flag.jpg" width="300" height="200" />
```

Note: You will need to configure your "Auto upload mapping" to do the above.

## Cloudinary `fit` values

Beside [the standard values for `fit` property](/components/nuxt-img#fit) of Nuxt image and Nuxt picture, Cloudinary offers the following for extra resizing experience:

* `minCover` - Same like `cover` but only resizing if the original image is **smaller** than the given minimum (width and height).
* `minInside` - Same as the `inside` mode but only if the original image is **smaller** than the given minimum (width and height).
* `coverLimit` - Same as the `cover` mode but only if the original image is **larger** than the given limit (width and height)
* `thumbnail`- Generate a thumbnail using face detection.
* `cropping` - Used to extract a given width & height out of the original image. The original proportions are retained.

Check out [Cloudinary resize mode Documentation](https://cloudinary.com/documentation/image_transformation_reference#crop_parameter) for more details.

## Cloudinary modifiers

Beside the [standard modifiers](/components/nuxt-img#modifiers), you can also pass the following Cloudinary-specific transformation params to `modifiers` prop.

::alert{type="info"}
The Cloudinary provider automatically enables [automatic format selection](https://cloudinary.com/documentation/image_transformations#f_auto) and [automatic quality selection](https://cloudinary.com/documentation/image_optimization#automatic_quality_selection_q_auto) for best performance.
::

### `rotate`

Accepted values:

* Any degree number, or
* `auto_right` | `auto_left` | `ignore` | `vflip` | `hflip`

To rotate or flip a given asset by certain degrees, or automatically based on orientation.

### `roundCorner`

Round the specified corners of the desired image. If pass only a number or `max` (all corners will be applied). The syntax for other use cases is as below:

* Using 2 values: `top_left_bottom_right_radius:top_right_bottom_left_radius`(Example: `20:40`)
* Using 3 values: `top_left:top_right_bottom_left:bottom_right` (Example: `20:30:40`)
* Using 4 values: `top_left:top_right:bottom_left:bottom_right` (Example: `20:0:40:40`)

```html
<NuxtImg
  provider="cloudinary"
  src="/remote/nuxt-org/blog/going-full-static/main.png"
  width="300"
  height="169"
  :modifiers="{ roundCorner: 'max' }"
/>
```

### `gravity`

Detemine which part of the image to cropped or to place the overlay.
Accepted values: `auto`, `subject`, `face`, `sink`, `faceCenter`, `multipleFaces`, `multipleFacesCenter`, `north`, `northEast`, `northWest`, `west`, `southWest`, `south`, `southEast`, `east`, `center`

```html
<NuxtImg
  provider="cloudinary"
  src="/remote/nuxt-org/blog/going-full-static/main.png"
  width="300"
  height="300"
  fit="fill"
  :modifiers="{ gravity: 'subject' }"
/>
```

### `effect`

Apply a filter or an effect on the desired asset. See [Effects for images](https://cloudinary.com/documentation/image_transformation_reference#effect_parameter) for the full list of syntax and available effects.

```html
<NuxtImg
  provider="cloudinary"
  src="/remote/nuxt-org/blog/going-full-static/main.png"
  width="300"
  height="300"
  fit="fill"
  :modifiers="{ effect: 'grayscale' }"
/>
```

### `color`

Color to use when text captions, shadow effect and colorize effect are in use.

```html
<NuxtImg
  provider="cloudinary"
  src="/remote/nuxt-org/blog/going-full-static/main.png"
  width="300"
  :modifiers="{ effect: 'colorize:50', color: 'red' }"
/>
```

### `flags`

One of more flags to alter the default transformation behavior. See [Flags for Images](https://cloudinary.com/documentation/image_transformation_reference#flags_parameter) for more information.

### `dpr`

The target device pixel ratio for the asset. `auto` means automatically matching the DPR settings in user's device.

### `opacity`

Adjust the opacity of the desired image. Scale: 0 to 100 (%).

```html
<NuxtImg
  provider="cloudinary"
  src="/remote/nuxt-org/blog/going-full-static/main.png"
  width="300"
  :modifiers="{ opacity: 50 }"
/>
```

### `overlay`

Create a layer **over** the base image. This can be use with `x`, `y`, `gravity` to customize the position of the overlay.

```html
<NuxtImg
  provider="cloudinary"
  src="/remote/nuxt-org/blog/going-full-static/main.png"
  width="100"
  height="100"
  fit="thumb"
  :modifiers="modifiers"
/>

<script>
  export default {
    data() {
      return {
        modifiers: {
          gravity: 'north',
          overlay: 'text:default_style:Hello+World',
        }
      }
    }
  }
</script>
```

See [Overlay Documentation](https://cloudinary.com/documentation/image_transformation_reference#overlay_parameter) for more information.

### `underlay`

Create a layer **below** a partial-transparent image. This can be use with `x`, `y`, `gravity` to customize the position of the overlay.

### `transformation`

A pre-defined named transformation to apply to the asset.

### `zoom`

Use together with `fit='crop'` or `fit='thumb'` to decide how much of original image/video surronding the face to keep using face detection.

```html [index.vue]
<template>
  <NuxtImg
    provider="cloudinary"
    src="/remote/nuxt-org/blog/going-full-static/main.png"
    width="100"
    height="100"
    fit="thumb"
    :modifiers="modifiers"
  />
</template>

<script>
  export default {
    data() {
      return {
        modifiers: {
          zoom: 0.75,
          gravity: "face"
        }
      }
    }
  }
</script>
```

### `colorSpace`

Color space to use for the delivery image url. See [Color space Documentation](https://cloudinary.com/documentation/image_transformation_reference#color_space_parameter) for accepted values details.

```html
<NuxtImg
  provider="cloudinary"
  src="/remote/nuxt-org/blog/going-full-static/main.png"
  width="300"
  :modifiers="{ colorSpace: 'srgb' }"
/>
```

### `customFunc`

Call a custom function on Cloudinary side. See [Custom Functions](https://cloudinary.com/documentation/custom_functions) for more details.

### `density`

To define the density number when converting a vector file to image format.

### `aspectRatio`

To crop or resize the asset to a new aspect ratio, for use with a crop/resize mode that determines how the asset is adjusted to the new dimensions.

::alert{type="info"}
See [Cloudinary Image Transformation API](https://cloudinary.com/documentation/image_transformation_reference) for more details.
::
