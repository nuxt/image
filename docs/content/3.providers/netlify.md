---
title: Netlify
description: Optimize images with Netlify's dynamic image transformation service.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/netlify.ts
    size: xs
---

When deploying your Nuxt applications to [Netlify's composable platform](https://docs.netlify.com/platform/overview/), the image module can use [Netlify Image CDN](https://docs.netlify.com/image-cdn/overview/) to optimize and transform images on demand without impacting build times. Netlify Image CDN also handles content negotiation to use the most efficient image format for the requesting client.

To use Netlify Image CDN by default, add the following to your Nuxt configuration:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    provider: 'netlify',
  }
})
```

## Remote images

To transform a source image hosted on another domain, you must first configure allowed domains in your `netlify.toml` file.

```toml [netlify.toml]
[images]
  remote_images = ["https://my-images.com/.*", "https://animals.more-images.com/[bcr]at/.*"]
```

The `remote_images` property accepts an array of regex. If your images are in specific subdomains or directories, you can use regex to allow just those subdomains or directories.

## Modifiers

In addition to the [standard properties](https://image.nuxt.com/usage/nuxt-img), all of the [Netlify Image CDN transformation options](https://docs.netlify.com/image-cdn/overview/#transform-images) are available as modifiers for Nuxt Image.

```vue
<NuxtImg
  provider="netlify"
  src="owl.jpg"
  :modifiers="{ 
    h="400"
    w="600"
    fit="cover"
    position="left"
    fm="webp"
    q="80"
  }"
/>
```

## Deprecated Netlify Large Media option

::callout{color="amber" icon="i-ph-warning-duotone"}
Netlify’s Large Media service is [deprecated](https://answers.netlify.com/t/large-media-feature-deprecated-but-not-removed/100804). If this feature is already enabled for your site on Netlify and you have already set `provider: 'netlify'` in your Nuxt configuration, then Large Media continues to work on your site as usual. However, new Large Media configuration is not recommended.
::

### Migrate to Netlify Image CDN

To migrate from the deprecated Netlify Large Media option to the more robust Netlify Image CDN option, change `provider: 'netlify'` to `provider: 'netlifyImageCdn'`.


### Use deprecated Netlify Large Media option

If you're not ready to migrate to the more robust Netlify Image CDN option, Netlify continues to support dynamic image transformation for all JPEG, PNG, and GIF files you have set to be tracked with [Netlify Large Media](https://docs.netlify.com/large-media/overview/). 

#### Large Media Modifiers

In addition to `height` and `width`, the deprecated Netlify Large Media provider supports the following modifiers:

##### `fit`

* **Default**: `contain`
* **Valid options**: `contain` (equivalent to `nf_resize=fit`) and `fill` (equivalent to `nf_resize=smartcrop`)
