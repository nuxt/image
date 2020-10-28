---
title: Image Component
description: 'List of available props for image component'
position: 7
category: Componets
---

## `src`

Path to image file. `src` sould be in form of absolute path and starts with `/`.

```vue
<template>
  <nuxt-image :src="src" ... />
</template>
```

The `src` has other capabilities in `nuxt-image`, you can provide provider and preset for the image right inside the `src` property.

### Provider

Nuxt image module will allow you to modify and serve your images using cloud services like cloudinary. In order to use a provider you should:
1. Define provider and its option in `nuxt.config`.
2. Specify providers name in `nuxt-image` component

<code-group>
  <code-block label="index.vue" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-image src="cloudinary:/remote/nuxt-org/blog/going-full-static/main.png" width="300" height="169" />
  </template>
  ```

  </code-block>
  <code-block label="nuxt.config.js">

  ```js{}[nuxt.config.js]
  export default {
    image: {
      providers: {
        cloudinary: {
          baseURL: 'https://res.cloudinary.com/nuxt/image/upload/'
        }
      }
    }
  }
  ```
  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-image src="cloudinary:/remote/nuxt-org/blog/going-full-static/main.png" width="300" height="169"></nuxt-image>
  </div>

  </code-block>
</code-group>

<!-- TODO: multiple providers -->
<!-- TODO: default provider -->


### Preset

Presets are predefined sets of image modifiers that can be used create unified form of images in your projects. You can write your presets inside `nuxt.config` and then use them in `nuxt-image`.

<code-group>
  <code-block label="index.vue" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-image src="+jpg-cover:/nuxt-icon.png" width="50" height="50" />
  </template>
  ```

  </code-block>
  <code-block label="nuxt.config.js">

  ```js{}[nuxt.config.js]
  export default {
    image: {
      presets: [
        {
          name: 'jpg-cover',
          modifiers: {
            fit: 'cover',
            format: 'jpg',
            width: 300,
            height: 300
          }
        }
      ]
    }
  }
  ```
  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-image src="+jpg-cover:/nuxt-icon.png" width="150" height="150"></nuxt-image>
  </div>

  </code-block>
</code-group>



### Provider + Presets

As you may notice providers and presets are different in their usage, and it is possible to use both providers and presets at the same time.

<code-group>
  <code-block label="index.vue" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-image src="cloudinary+jpg-cover:/remote/nuxt-org/blog/going-full-static/main.png" width="300" height="169" />
  </template>
  ```

  </code-block>
  <code-block label="nuxt.config.js">

  ```js{}[nuxt.config.js]
  export default {
    image: {
      presets: [
        {
          name: 'jpg-cover',
          modifiers: {
            fit: 'cover',
            format: 'jpg',
            width: 300,
            height: 300
          }
        }
      ],
      providers: {
        cloudinary: {
          baseURL: 'https://res.cloudinary.com/nuxt/image/upload/'
        }
      }
    }
  }
  ```
  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-image src="cloudinary+jpg-cover:/remote/nuxt-org/blog/going-full-static/main.png" width="300" height="169" />
  </div>

  </code-block>
</code-group>

## `no-script`
Genererate `<noscript>` tag for browsers that aren’t running javascript.

## `lazy`

By default `nuxt-image` lazy load all images to reduce initial requests and page size. Using `lazy` prop you can disable lazy loading.

<code-group>
  <code-block label="index.vue" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-image :lazy="false" src="cloudinary+jpg-cover:/remote/nuxt-org/blog/going-full-static/main.png" width="300" height="169" />
  </template>
  ```

  </code-block>
  <code-block label="nuxt.config.js">

  ```js{}[nuxt.config.js]
  export default {
    image: {
      presets: [
        {
          name: 'jpg-cover',
          modifiers: {
            fit: 'cover',
            format: 'jpg',
            width: 300,
            height: 300
          }
        }
      ],
      providers: {
        cloudinary: {
          baseURL: 'https://res.cloudinary.com/nuxt/image/upload/'
        }
      }
    }
  }
  ```
  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-image lazy="false" src="cloudinary+jpg-cover:/remote/nuxt-org/blog/going-full-static/main.png" />
  </div>

  </code-block>
</code-group>


## `placeholder`

The placeholder is a small, low quality image that will show while the original image is loading. You could provide your own placeholder or let `nuxt-image` generate it for you.  
If you set `placeholder` to `true`, module creates a small placeholder for you. You can set your custom placeholder in this prop.


<code-group>
  <code-block label="Auto Generate" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-image :placeholder="true" src="/nuxt-icon.png" />
  </template>
  ```
  </code-block>
  <code-block label="Custom Placeholder">

  ```vue{}[index.vue]
  <template>
    <nuxt-image :placeholder="/icon.png" src="/nuxt-icon.png" />
  </template>
  ```
  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-image placeholder="/icon.png" src="/nuxt-icon.png"></nuxt-image>
  </div>

  </code-block>
</code-group>

## `sets`

The `sets` attribute specifies the URL of the image to use in different situations. With `sets`, the browser does the work of figuring out which image is best to load and render.  
In `nuxt-image` you can simply provide various sizes and width breakpoints to generate `srcset`. Resized images are automatically created from the image `src`.

A set is consists of `width` and `breakpoint` or `media`: 
- `width`: Width of generated image for this set
- `breakpoint`: Minimum width of viewport to show the image
- `media`: Custom media query for the set, using `media` will override `breakpoint`

Note that you should define set in the ascending order of their width or break point.

### Simple string formatted usage
I this case you should create a comma separated list of sizes and breakpoints. Separate `breakpoint` and `width` of a set with `:`.

```vue{}[index.vue]
<template>
  <nuxt-image sets="300,300:600,600:900" ... />
  <!--               |   |   |   |   | -->
  <!--------- width -^   |   |   |   | -->
  <!--                   |   |   |   | -->
  <!------- breakpoint --^   |   |   | -->
  <!---------------- width --^   |   | -->
  <!--                           |   | -->
  <!--------------- breakpoint --^   | -->
  <!------------------------ width --^ -->
</template>
```

### Advances array formatted usage
Using array will help you to create custom media queries of different sets and have more conrtol on different viewport sizes.

```vue{}[index.vue]
<template>
  <nuxt-image :sets="sets" ... />
</template>

<script>
export default {
  data() {
    return {
      sets: [
        {
          width: 300
        },
        {
          breakpoint: 300,
          width: 600
        },
        {
          media: '(min-width: 600px)', // same as breakpoint: 600
          width: 900
        }
      ]
    }
  }
}
</script>
```

## `alt`

This prop specifies an alternate text for an image.

## `format`

In case you want to serve images in specific format, use this prop.

```vue{}[index.vue]
<template>
  <nuxt-image format="webp" src="/nuxt-icon.png" ... />
</template>
```

## `fit`

The `fit` property specifies the size of the images.  
There are five standard values you can use with this property.

- `cover`: (default) Preserving aspect ratio, ensure the image covers both provided dimensions by cropping/clipping to fit
- `contain`: Preserving aspect ratio, contain within both provided dimensions using "letterboxing" where necessary.
- `fill`: Ignore the aspect ratio of the input and stretch to both provided dimensions.
- `inside`: Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
- `outside`: Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to both those specified.


<code-group>
  <code-block label="index.vue" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-image fit="cover" src="/nuxt-icon.png" width="200" height="100" />
  </template>
  ```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
  <nuxt-image fit="cover" src="/nuxt-icon.png" width="200" height="100" />
  </div>

  </code-block>
</code-group>

## `operations`

In addition of standard operation, every provider can have their own operation. For example cloudinary supports lots of [transformations](https://cloudinary.com/documentation/image_transformations). Using `operations` prop you can use these transformations.

<code-group>
  <code-block label="index.vue" active>

  ```vue{}[index.vue]
  <template>
    <nuxt-image
      src="cloudinary:/remote/nuxt-org/blog/going-full-static/main.png"
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
          r: '0:100'
        }
      }
    }
  }
  </script>
  ```

  </code-block>
  <code-block label="Preview">

  <div class="text-center p-4 bg-gray-800 rounded-b-md">
    <nuxt-image
      width="300" 
      height="169"
      src="cloudinary:/remote/nuxt-org/blog/going-full-static/main.png" :operations="{r: '0:100'}"
    />
    <a href="https://cloudinary.com/documentation/image_transformations#rounding_corners_and_creating_circular_images">
      Rounding values
    </a>
  </div>

  </code-block>
</code-group>
