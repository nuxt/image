---
title: Netlify
description: Optimize images with Netlify's dynamic image transformation service.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/netlify.ts
    size: xs
---

When deploying your Nuxt applications to [Netlify's composable platform](https://docs.netlify.com/platform/overview), the image module uses [Netlify Image CDN](https://docs.netlify.com/image-cdn/overview) to optimize and transform images on demand without impacting build times. Netlify Image CDN also handles content negotiation to use the most efficient image format for the requesting client.

This provider is automatically enabled in Netlify deployments, and also when running locally using the [Netlify CLI](https://docs.netlify.com/cli/local-development).

You can also manually enable this provider. To do so, set the provider to `netlify` or add the following to your Nuxt configuration:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    provider: 'netlify'
  }
})
```

## Local Development

To test image transformations locally, use [Netlify Dev](https://docs.netlify.com/cli/local-development). This feature of the Netlify CLI runs a local development server that mimics the Netlify production environment, including Netlify Image CDN.

## Remote Images

To transform a source image hosted on another domain, you must first configure allowed domains:

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    provider: 'netlify',
    domains: ['images.example.com']
  }
})
```

## Modifiers

Beyond the [standard properties](https://image.nuxt.com/usage/nuxt-img), you can use the [Netlify Image CDN `position` parameter](https://docs.netlify.com/image-cdn/overview/#position) as a modifier for Nuxt Image.

```vue
<NuxtImg
  provider="netlify"
  src="owl.jpg"
  height="400"
  width="600"
  fit="cover"
  format="webp"
  quality="80"
  :modifiers="{ position: 'left' }"
/>
```

## Deprecated Netlify Large Media option

::warning
Netlify’s Large Media service is [deprecated](https://answers.netlify.com/t/large-media-feature-deprecated-but-not-removed/100804). If this feature is already enabled for your site on Netlify and you have already set `provider: 'netlify'` in your Nuxt configuration, then this will be detected at build time and Large Media continues to work on your site as usual. You can also explicitly enable it by setting `provider: 'netlifyLargeMedia'`. However, new Large Media configuration is not recommended.
::

### Migrate to Netlify Image CDN

To migrate from the deprecated Netlify Large Media option to the more robust Netlify Image CDN option, change `provider: 'netlify'` to `provider: 'netlifyImageCdn'`. This will enable the Netlify Image CDN service, even if large media is enabled on your site.

### Use deprecated Netlify Large Media option

If you're not ready to migrate to the more robust Netlify Image CDN option, Netlify continues to support dynamic image transformation for all JPEG, PNG, and GIF files you have set to be tracked with [Netlify Large Media](https://docs.netlify.com/large-media/overview).

#### Large Media Modifiers

In addition to `height` and `width`, the deprecated Netlify Large Media provider supports the following modifiers:

##### `fit`

- **Default**: `contain`
- **Valid options**: `contain` (equivalent to `nf_resize=fit`) and `fill` (equivalent to `nf_resize=smartcrop`)
