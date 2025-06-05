---
title: Storyblok
description: Nuxt Image internally use Storyblok as static provider.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/storyblok.ts
    size: xs
---

Integration between [Storyblok](https://www.storyblok.com/docs/image-service) and the image module. To use this provider you just need to specify the base URL of your service in Storyblok.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    storyblok: {
      baseURL: 'https://a.storyblok.com'
    }
  }
})
```

## Storyblok Modifiers

Check out available [Storyblok image service](https://www.storyblok.com/docs/api/image-service/operations) modifiers.

### Resizing

Check [Storyblok documentation](https://www.storyblok.com/docs/image-service#resizing) if you want to know more.

the logic is:

- If you do not define either width or height, the image will not be resized.
- If you define only width or only height the image will be proportionately resized based on the one you defined.

Example:

```vue
<!-- Original -->
<NuxtImg
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
/>

<!-- Resized static -->
<NuxtImg
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
  width="500"
  height="500"
/>

<!-- Proportional to width -->
<NuxtImg
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
  width="500"
/>

<!-- Proportional to height -->
<NuxtImg
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
  height="500"
/>
```

### Fit in with background or not

Check [Storyblok documentation](https://www.storyblok.com/docs/image-service#fit-in) if you want to know more.

If you want to use it just add a props `fit="in"`. Take care that Storyblok only support `fit-in`.

You can also use the fill filters to fill your fit-in with a specific background. If you not defining value it will be transparent.

Example:

```vue
<NuxtImg
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
  width="200"
  height="200"
  fit="in"
  :modifiers="{ filters: { fill: 'CCCCCC' } }"
/>
```

### Format

Check [Storyblok documentation](https://www.storyblok.com/docs/image-service#changing-the-format) if you want to know more.

You can modify your image format. Supported format are `webp`, `jpeg` and `png`.

Example:

```vue
<NuxtImg
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
  width="200"
  format="webp"
/>
```

### Quality

Check [Storyblok documentation](https://www.storyblok.com/docs/image-service#quality-optimization) if you want to know more.

You can update your image quality by defining the quality filters.

Example:

```vue
<NuxtImg
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
  width="200"
  quality="10"
/>
```

### Facial detection

Check [Storyblok documentation](https://www.storyblok.com/docs/image-service#facial-detection-and-smart-cropping) if you want to know more.

To have a smart crop just define a smart property inside modifier.

Example:

```vue
<NuxtImg
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg"
  width="600"
  height="130"
  :modifiers="{ smart: true }"
/>
```

### Custom focal point

Check [Storyblok documentation](https://www.storyblok.com/docs/image-service#custom-focal-point) if you want to know more.

Storyblok allows you to focalize on a specific part of your image. Just use `focal` filters.

Example:

```vue
<!-- Focus on the top of the image -->
<NuxtImg
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/1000x600/d962430746/demo-image-human.jpeg"
  width="600"
  height="130"
  :modifiers="{ filters: { focal: '450x0:550x100' } }"
/>

<!-- Focus on the bottom of the image -->
<NuxtImg
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/1000x600/d962430746/demo-image-human.jpeg"
  width="600"
  height="130"
  :modifiers="{ filters: { focal: '450x500:550x600' } }"
/>
```
