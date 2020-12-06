---
title: Cloudinary Provider
description: ''
position: 11
category: Providers
---

Integration between [Cloudinary](https://cloudinary.com) and the image module.  
To use this provider you just need to specify the base url of your project in cloudinary.

```js{}[nuxt.config.js]
export default {
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/nuxt/image/upload/'
    }
  }
}
```

## Cloudinary `fit` values

Beside [the standard values for `fit` property](/nuxt-img#fit) of Nuxt image and Nuxt picture, Cloudinary offers the following for extra resizing experience:

* `minCover` - Same like `cover` but only resizing if the original image is **smaller** than the given minimum (width and height).
* `minInside` - Same as the `inside` mode but only if the original image is **smaller** than the given minimum (width and height).
* `coverLimit` - Same as the `cover` mode but only if the original image is **larger** than the given limit (width and height)
* `thumbnail`- Generate a thumbnail using face detection.
* `cropping` - Used to extract a given width & height out of the original image. The original proportions are retained.

Check out [Cloudinary resize mode Documentation](https://cloudinary.com/documentation/image_transformation_reference#crop_parameter) for more details.

## Cloudinary operations

Beside the [standard operations](/nuxt-img), you can also pass the following Cloudinary-specific transformation params to `operations`:

### `rotate`

Accepted values: 
  * Any degree number, or 
  * `auto_right` | `auto_left` | `ignore` | `vflip` | `hflip`  

To rotate or flip a given asset by certain degrees, or automatically based on orientation.

### `roundCorner`

Round the specified corners of the desired image. If pass only a number or `max` (all corners will be applied). The syntax for other use cases is as below:

  - Using 2 values: `top_left_bottom_right_radius:top_right_bottom_left_radius`(Example: `20:40`)
  - Using 3 values: `top_left:top_right_bottom_left:bottom_right` (Example: `20:30:40`)
  - Using 4 values: `top_left:top_right:bottom_left:bottom_right` (Example: `20:0:40:40`)

<code-group>
  <code-block label="index.vue" active>

```html{}[index.vue]
<template>
  <nuxt-img
    provider="cloudinary"
    src="/remote/nuxt-org/blog/going-full-static/main.png"
    width="300"
    height="169"
    :operations="imageOperations"
  />
</template>

<script>
  export default {
    data() {
      return {
        imageOperations: {
          roundCorner: 'max'
        }
      }
    }
  }
</script>
```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-img
      width="300" 
      height="169"
      provider="cloudinary"
      src="/remote/nuxt-org/blog/going-full-static/main.png" :operations="{ roundCorner: 'max'}"
    />
    <a href="https://cloudinary.com/documentation/image_transformations#rounding_corners_and_creating_circular_images">
      Rounding values
    </a>
  </div>

  </code-block>
</code-group>

### `gravity`

Detemine which part of the image to cropped or to place the overlay.  
Accepted values: `auto`, `subject`, `face`, `sink`, `faceCenter`, `multipleFaces`, `multipleFacesCenter`, `north`, `northEast`, `northWest`, `west`, `southWest`, `south`, `southEast`, `east`, `center`

<code-group>
  <code-block label="index.vue" active>

```html{}[index.vue]
<template>
  <nuxt-img
    provider="cloudinary"
    src="/remote/nuxt-org/blog/going-full-static/main.png"
    width="300"
    height="300"
    fit="fill"
    :operations="imageOperations"
  />
</template>

<script>
  export default {
    data() {
      return {
        imageOperations: {
          gravity: 'subject'
        }
      }
    }
  }
</script>
```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-img
      width="300" 
      fit="fill"
      height="300"
      provider="cloudinary"
      src="/remote/nuxt-org/blog/going-full-static/main.png" :operations="{ gravity: 'subject'}"
    />
  </div>

  </code-block>
</code-group>

### `effect`

Apply a filter or an effect on the desired asset. See [Effects for images](https://cloudinary.com/documentation/image_transformation_reference#effect_parameter) for the full list of syntax and available effects.

<code-group>
  <code-block label="index.vue" active>

```html{}[index.vue]
<template>
  <nuxt-img
    provider="cloudinary"
    src="/remote/nuxt-org/blog/going-full-static/main.png"
    width="300"
    height="300"
    fit="fill"
    :operations="imageOperations"
  />
</template>

<script>
  export default {
    data() {
      return {
        imageOperations: {
          effect: 'grayscale'
        }
      }
    }
  }
</script>
```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-img
      width="300" 
      fit="fill"
      height="300"
      provider="cloudinary"
      src="/remote/nuxt-org/blog/going-full-static/main.png" :operations="{ effect: 'grayscale'}"
    />
  </div>

  </code-block>
</code-group>

### `color`

Color to use when text captions, shadow effect and colorize effect are in use.

<code-group>
  <code-block label="index.vue" active>

```html{}[index.vue]
<template>
  <nuxt-img
    provider="cloudinary"
    src="/remote/nuxt-org/blog/going-full-static/main.png"
    width="300"
    :operations="imageOperations"
  />
</template>

<script>
  export default {
    data() {
      return {
        imageOperations: {
          effect: 'colorize:50',
          color: 'red'
        }
      }
    }
  }
</script>
```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-img
      width="300" 
      provider="cloudinary"
      src="/remote/nuxt-org/blog/going-full-static/main.png" :operations="{ effect: 'colorize:50', color: 'red' }"
    />
  </div>

  </code-block>
</code-group>

### `flags`

One of more flags to alter the default transformation behavior. See [Flags for Images](https://cloudinary.com/documentation/image_transformation_reference#flags_parameter) for more information.

### `dpr`

The target device pixel ratio for the asset. `auto` means automatically matching the DPR settings in user's device.

### `opacity`

Adjust the opacity of the desired image. Scale: 0 to 100 (%).

<code-group>
  <code-block label="index.vue" active>

```html{}[index.vue]
<template>
  <nuxt-img
    provider="cloudinary"
    src="/remote/nuxt-org/blog/going-full-static/main.png"
    width="300"
    :operations="imageOperations"
  />
</template>

<script>
  export default {
    data() {
      return {
        imageOperations: {
          opacity: 50
        }
      }
    }
  }
</script>
```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-img
      width="300" 
      provider="cloudinary"
      src="/remote/nuxt-org/blog/going-full-static/main.png" :operations="{ opacity: 50 }"
    />
  </div>

  </code-block>
</code-group>

### `overlay`

Create a layer **over** the base image. This can be use with `x`, `y`, `gravity` to customize the position of the overlay.

```html{}[index.vue]
<template>
  <nuxt-img
    provider="cloudinary"
    src="/remote/nuxt-org/blog/going-full-static/main.png"
    width="100"
    height="100"
    fit="thumb"
    :operations="imageOperations"
  />
</template>

<script>
  export default {
    data() {
      return {
        imageOperations: {
          gravity: "north",
          overlay: "text:default_style:Hello+World",
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

```html{}[index.vue]
<template>
  <nuxt-img
    provider="cloudinary"
    src="/remote/nuxt-org/blog/going-full-static/main.png"
    width="100"
    height="100"
    fit="thumb"
    :operations="imageOperations"
  />
</template>

<script>
  export default {
    data() {
      return {
        imageOperations: {
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

```html{}[index.vue]
<template>
  <nuxt-img
    provider="cloudinary"
    src="/remote/nuxt-org/blog/going-full-static/main.png"
    width="300"
    :operations="imageOperations"
  />
</template>

<script>
  export default {
    data() {
      return {
        imageOperations: {
          colorSpace: "srgb"
        }
      }
    }
  }
</script>
```

### `customFunc`

Call a custom function on Cloudinary side. See [Custom Functions](https://cloudinary.com/documentation/custom_functions) for more details.

### `density`

To define the density number when converting a vector file to image format.

<alert type="info">

See [Cloudinary Image Transformation API](https://cloudinary.com/documentation/image_transformation_reference) for more details.

</alert>