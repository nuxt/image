---
title: Builder.io
description: Nuxt Image integration with Builder.io Image API.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/builderio.ts
    size: xs
---

Integration between [Builder.io Image API](https://www.builder.io/c/docs/image-api) and Nuxt Image.

The Builder.io Image API provides optimized image transformations for images uploaded to Builder.io.

## Modifiers

The Builder.io provider supports the following modifiers:

- `width`
- `height`
- `format`
- `quality`
- `fit`
- `position`

### Format

The `format` modifier is supported with the following values:

- `webp`
- `jpg`
- `jpeg`
- `png`
- `gif`
- `original`

```vue
<NuxtImg src="..." width="300" height="300" modifiers="{ format: 'webp' }" />
```

### Quality

The `quality` modifier is supported. Values range from 1 (worst quality, smallest file size) to 100 (best quality, largest file size). Default is 85.

```vue
<NuxtImg src="..." width="300" height="300" modifiers="{ quality: 90 }" />
```

### Fit

The `fit` modifier determines how the image should fit within the specified dimensions. Valid values are:

- `cover` - Cover the entire area (default)
- `contain` - Fit within the area while maintaining aspect ratio
- `fill` - Fill the area, potentially distorting the image
- `inside` - Fit inside the area while maintaining aspect ratio
- `outside` - Fit outside the area while maintaining aspect ratio

**Note:** The `fit` parameter only has an effect if `format` is set to `webp`.

```vue
<NuxtImg src="..." width="300" height="300" modifiers="{ fit: 'contain', format: 'webp' }" />
```

### Position

The `position` modifier determines the anchor point for cropping when `fit` is used. Valid values are:

- `top`
- `right top`
- `right`
- `right bottom`
- `bottom`
- `left bottom`
- `left`
- `left top`
- `center` (default)

**Note:** The `position` parameter only has an effect if `format` is set to `webp`.

```vue
<NuxtImg src="..." width="300" height="300" modifiers="{ position: 'bottom left', format: 'webp' }" />
```

## Usage

To use this provider, pass the image URL from Builder.io to the `src` prop:

```vue
<NuxtImg 
  provider="builderio"
  src="https://cdn.builder.io/api/v1/image/assets/YJIGb4i01jvw0SRdL5Bt/869bfbaec9c64415ae68235d9b7b1425"
  width="300"
  height="300"
/>
```

For more information about the Builder.io Image API, see the [official documentation](https://www.builder.io/c/docs/image-api).

