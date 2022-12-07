# ImageEngine

Nuxt Image has first class integration with ImageEngine

---

Integration between [ImageEngine](https://imageengine.io/) and the image module.

At a minimum, you must configure the `imageengine` provider with the `baseURL` set to your ImageEngine Delivery Address:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    imageengine: {
      baseURL: 'https://xxxxx.imgeng.in'
    }
  }
})
```

## ImageEngine `fit` values

The [standard values for `fit` property](/components/nuxt-img#fit) map onto [ImageEngine Directives](https://imageengine.io/docs/directives) as follows:

* `cover`: `m_cropbox`
* `contain`: `m_letterbox`
* `fill`: `m_stretch`
* `inside`: `m_box`, this is the default fit method for the ImageEngine provider.
* `outside`: This fit method is not supported and functions the same as `inside`.

## ImageEngine modifiers

In addition to the [standard modifiers](/components/nuxt-img#modifiers), you can also use all [ImageEngine Directives](https://imageengine.io/docs/directives) by adding them to the `modifiers` property with the following attribute names:

* `format`: `f` directive
* `fit`: `m` directive
* `passThrough`: `pass` directive
* `sharpen`: `s` directive
* `rotate`: `r` directive
* `screenPercent`: `pc` directive
* `crop`: `cr` directive
* `inline`: `in` directive
* `metadata`: `meta` directive

> Note that the standard `quality` attribute is converted to the ImageEngine `cmpr` compression directive.  `quality` is the opposite of compression, so 80% quality equals 20% compression.  Since ImageEngine automatically adapts image quality the visitor's device, browser and network quality, it is recommended that you do not explicitly set the quality.  If you want to completely disable all optimizations to an image, you should use `:modifiers="{ passThrough: 'true' }"`, which will serve the unaltered image.

Example 1: Cropping an image to a width and height of 100x80, starting 10 pixels from the top and 20 pixels from the left:

```html
<nuxt-img
  provider="imageengine"
  src="/some-image.jpg"
  width="100"
  height="80"
  :modifiers="{ cr: '100,80,10,20' }"
/>
```

Example 2: Instruct ImageEngine to keep the image's EXIF metadata (which is normally removed to reduce the image byte size):

```html
<nuxt-img
  provider="imageengine"
  src="/some-image.jpg"
  width="100"
  height="80"
  :modifiers="{ meta: 'true' }"
/>
```

## ImageEngine best practices

### Automatic format and quality detection

ImageEngine automatically detects the best format and quality for your image based on the characteristics of the specific device that requested it.

This feature is very effective and it is not recommended that you disable it, but if you must, you can manually specify the format (ex: `format='webp'`) and quality (`quality='80'`).

### ImageEngine settings

ImageEngine allows you to set all of the modifiers/directives in the ImageEngine control panel under advanced settings.  This is a good place to set default adjustments since you can modify them without having to make changes to your Nuxt codebase.  If a directive is set in both Nuxt and the ImageEngine User-Adjustable Settings, the value in Nuxt takes priority.
