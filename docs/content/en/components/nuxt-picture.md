---
title: Usage of <nuxt-picture> component
description: 'Discover how to use and configure the nuxt-picture component.'
menuTitle: <nuxt-picture>
category: Components
position: 202
---

`<nuxt-picture>` is an advanced component designed to optimize and load images on the modern web.

- Loading Placeholder
- Serve modern format `webp` when browser supports it
- Generates responsive `srcSet`

If you want to use modern and optimized formats like `webp` or `avif` and support browsers like `IE` or `Safari` you should use the `nuxt-picture` component.

The `nuxt-picture` component is based on the HTML `<picture>` tag. This component is designed to support modern formats and improve browser compatibility at the same time.

<code-group>
  <code-block label="index.vue" active>

```html
<nuxt-picture src="/nuxt-icon.png" placeholder />
```

  </code-block>
</code-group>

When you use `<nuxt-picture>`, it automatically calculates the aspect ratio of the image and sets the size of the image based on the aspect ratio. The image's width will be equal to the width of the parent element in the DOM and its height will be calculated based on the aspect ratio.

Forcing images to preserve their aspect ratio will prevent [layout shifting](https://web.dev/cls/).

If you want to resize the image all you need to do is change the width using CSS.

You can control the aspect ratio of the image using `width` and `height` props. If you provide both `width` and `height`, the aspect ratio will be calculated using the `width` and `height`.

<alert type="info">

`<nuxt-picture>` supports all available props of [`<nuxt-img>`](/components/nuxt-img) with these additional props.

</alert>

## `loading`

- Type:`String`
  - Default: `'lazy'`
  - String values: `'eager'` or `'lazy'`, [learn more](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading).

By default, `<nuxt-picture>` lazy loads the image to reduce initial requests and page size.

To disable lazy loading, use `loading="eager"`:

```html
<nuxt-picture src="/main.png" loading="eager" width="400" height="300" />
```

## `placeholder`

- Type: `Boolean` or `String`
  - Default: `false`
  - String value: source of the image

The placeholder is a small, low quality image that will show while the original image is loading.

You can provide your own placeholder or let `<nuxt-picture>` generate it for you.

If you add the `placeholder` prop, Nuxt image will create the placeholder image:

```html
<nuxt-picture
  placeholder
  src="https://images.unsplash.com/photo-1606661247834-eb1f16814366?w=1950&q=80"
/>
```

You can set a custom placeholder by using a source in the `placeholder` prop:

```html
<nuxt-picture
  placeholder="https://images.unsplash.com/photo-1606661247834-eb1f16814366?w=20&q=80"
  src="https://images.unsplash.com/photo-1606661247834-eb1f16814366?w=1950&q=80"
/>
```
