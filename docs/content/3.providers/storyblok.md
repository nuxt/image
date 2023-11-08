---
title: Storyblok
description: Nuxt Image internally use Storyblok as static provider.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/storyblok.ts
    size: xs
---

Integration between [Storyblok](https://www.storyblok.com/docs/image-service/) and the image module. To use this provider you just need to specify the base url of your service in Storyblok.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    storyblok: {
      baseURL: 'https://a.storyblok.com'
    }
  }
})
```

## Storyblok modifiers

I am following all modifiers present on [Storyblok image service](https://www.storyblok.com/docs/image-service/)

### Resizing

Check [Storyblok documentation](https://www.storyblok.com/docs/image-service#resizing) if you want to know more.

the logic is:

- If you do not define either width or height, the image will not be resized.
- If you define only width or only height the image will be proportionately resized based on the one you defined.

Example:

```html
<div>Original</div>
<NuxtImg
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
/>

<div>Resized static</div>
<NuxtImg
  width="500"
  height="500"
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
/>

<div>Proportional to Width</div>
<NuxtImg
  width="500"
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
/>

<div>Proportional to Height</div>
<NuxtImg
  height="500"
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
/>
```

### Fit in with background or not

Check [Storyblok documentation](https://www.storyblok.com/docs/image-service#fit-in) if you want to know more.

If you want to use it just add a props `fit="in"`. Take care that storyblok only support `fit-in`.

You can also use the fill filters to fill your fit-in with a specific background. If you not defining value it will be transparent.

Example:

```html
<div>Fit in with background CCCCCC</div>
<NuxtImg
  width="200"
  height="200"
  fit="in"
  :modifiers="{ filters: { fill: 'CCCCCC' } }"
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
/>
```

### Format

Check [Storyblok documentation](https://www.storyblok.com/docs/image-service#changing-the-format) if you want to know more.

You can modify your image format. Supported format are `webp`, `jpeg` and `png`.

Example:

```html
<h3>Format</h3>
<NuxtImg
  width="200"
  format="webp"
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
/>
```

### Quality

Check [Storyblok documentation](https://www.storyblok.com/docs/image-service#quality-optimization) if you want to know more.

You can update your image quality by defining the quality filters.

Example:

```html
 <div class="flex">
<div>Resized and 10% Quality</div>
<NuxtImg
  provider="storyblok"
  width="200"
  quality="10"
  src="https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg"
/>
</div>
```

### Facial detection

Check [Storyblok documentation](https://www.storyblok.com/docs/image-service#facial-detection-and-smart-cropping) if you want to know more.

To have a smart crop just define a smart property inside modifier.

Example:

```html
<h3>Facial detection</h3>

<div>Resized without Smart Crop</div>
<NuxtImg
  width="600"
  height="130"
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg"
/>

<div>Resized with Smart Crop</div>
<NuxtImg
  width="600"
  height="130"
  :modifiers="{ smart: true }"
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg"
/>
```

### Custom focal point

Check [Storyblok documentation](https://www.storyblok.com/docs/image-service#custom-focal-point) if you want to know more.

Storyblok offer you the focalize on a specific part of your image. Just use `focal` filters.

Example:

```html
<div>Focus on the bottom of the image</div>
<NuxtImg
  width="600"
  height="130"
  :modifiers="{ filters: { focal: '450x500:550x600' } }"
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/1000x600/d962430746/demo-image-human.jpeg"
/>

<div>Focus on the top of the image</div>
<NuxtImg
  width="600"
  height="130"
  :modifiers="{ filters: { focal: '450x0:550x100' } }"
  provider="storyblok"
  src="https://a.storyblok.com/f/39898/1000x600/d962430746/demo-image-human.jpeg"
/>
```
