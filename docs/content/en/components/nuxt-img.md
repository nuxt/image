---
title: Usage of <nuxt-img> component
description: 'Discover how to use and configure the nuxt-img component.'
menuTitle: <nuxt-img>
category: Components
position: 201
---

`<nuxt-img>` is a replacement for the native `<img>` tag with no additional styles and supporting all native attributes.

- Use built-in static provider to optimize local and remote images
- Converts `src` to provider URL
- Automatically resize images based on `width` and `height` attributes
- Support `loading="lazy"` with wider range of browsers (see [native support](https://caniuse.com/loading-lazy-attr))
- Automatically generate `alt` attribute based on `src`.
- Optionally generate responsive `src-set` and `sizes` attrs with `responsive` prop

Use it like you would use the `<img>` tag:

```html
<nuxt-img src="/nuxt-icon.png" />
```

Will result in:

```html
<img src="/nuxt-icon.png" alt="nuxt-icon" />
```

## `src` Path to image file. `src` should be in the form of an absolute path

that starts with `/` or a URL.

```html
<nuxt-img :src="src" ... />
```

To accept image optimization on external websites (not `src` starting with `/`), you need to whitelist them in the [`accept`](/api/options#accept) option.

## `width`

Specify width of the image.
`nuxt-img` uses this value to optimize the image as best as its possible:

- This value will set as `width` attribute of DOM element
- On `layout != "responsive"`
  - When both `width` and `height` are present and values aren't equal to `auto`, this value will be used to resize the image.
  - On server-side rendering when the value equals `auto` and height is not set or equal to `auto`, `nuxt-img` will automatically detect the image's size and use it. (This does not happens on client-side rendering)
  - On server-side rendering when the value equals `auto` and `height` is set, `nuxt-img` will automatically detect the image's size and calculate the proper width based on the image's aspect ratio and `height` value. (This does not happens on client-side rendering)
  - On server-side rendering the image will resize using the calculated `width`

## `height`

Specify height of the image.
`nuxt-img` uses this value to optimize the image as best as its possible:

- This value will be set as `height` attribute of DOM element
- On `layout != "responsive"`
  - When both `width` and `height` are present and values aren't equal to `auto`, this value will use to resize the image.
  - On the server-side rendering when the value equals to `auto` and width is not set or equal to `auto`, `nuxt-img` will automatically detects image's size and use it. (This not happens on client-side rendering)
  - On the server-side rendering when the value equals to `auto` and `width` is set, `nuxt-img` will automatically detects image's size and calulates proper height based on image's aspect ratio and `width` value. (This not happens on client-side rendering)
  - On the server-side rendering the image will resize using calculated `height`

## `provider`

Nuxt image module will allow you to modify and serve your images using cloud services like Cloudinary. In order to use a provider you should:

1. Define provider and its option in `nuxt.config`.
2. Specify providers name in `nuxt-img` component

<code-group>
  <code-block label="index.vue" active>

```html
<template>
  <nuxt-img
    provider="cloudinary"
    src="/remote/nuxt-org/blog/going-full-static/main.png"
    width="300"
    height="169"
  />
</template>
```

  </code-block>
  <code-block label="nuxt.config.js">

```js{}[nuxt.config.js]
export default {
  image: {
    cloudinary: {
      baseURL: "https://res.cloudinary.com/nuxt/image/upload/",
    },
  },
};
```

  </code-block>
</code-group>

<!-- TODO: multiple providers -->
<!-- TODO: default provider -->

## `preset`

Presets are predefined sets of image modifiers that can be used create unified form of images in your projects. You can write your presets inside `nuxt.config` and then use them in `nuxt-img`.

<code-group>
  <code-block label="index.vue" active>

```html
<template>
  <nuxt-img preset="jpg-cover" src="/nuxt-icon.png" width="50" height="50" />
</template>
```

  </code-block>
  <code-block label="nuxt.config.js">

```ts
export default {
  image: {
    presets: [
      cover: {
        modifiers: {
          fit: "cover",
          format: "jpg",
          width: 300,
          height: 300,
        },
      },
    ],
  },
};
```

  </code-block>
</code-group>

## `format`

In case you want to serve images in a specific format, use this prop.

```html
<nuxt-img format="webp" src="/nuxt-icon.png" ... />
```

Available formats are `webp`, `jpeg`, `jpg`, `png`, `gif` and `svg`. If the format is not specified, it will respect the default image format.

## `quality`

The quality for the generated image(s).

```html
<nuxt-img src="/nuxt.jpg" quality="80" width="200" height="100" />
```

## `fit`

The `fit` property specifies the size of the images.
There are five standard values you can use with this property.

- `cover`: (default) Preserving aspect ratio, ensure the image covers both provided dimensions by cropping/clipping to fit
- `contain`: Preserving aspect ratio, contain within both provided dimensions using "letterboxing" where necessary.
- `fill`: Ignore the aspect ratio of the input and stretch to both provided dimensions.
- `inside`: Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
- `outside`: Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to both those specified.

```html
<nuxt-img fit="cover" src="/nuxt-icon.png" width="200" height="100" />
```

<alert type="info">

Some providers provide additional values besides the above standard ones, such as [Cloudinary values](/providers/cloudinary#cloudinary-fit-values) for extra resizing effects.

</alert>

## `modifiers`

In addition to standard operations, every provider can have their own operation. For example Cloudinary supports lots of [modifiers](/providers/cloudinary#cloudinary-modifiers).

Using the `modifiers` prop lets you use any of these transformations.

```html
<nuxt-img
  provider="cloudinary"
  src="/remote/nuxt-org/blog/going-full-static/main.png"
  width="300"
  height="169"
  :modifiers="{ roundCorner: '0:100' }"
/>
```
