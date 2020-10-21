---
title: How it works
description: ''
position: 7
category: Guide
---

## Componets behavior
The behavior of Image module is different inproject based on deployment targets.  
Note that the behavior of `nuxt-picture` is similar to `nuxt-image`.

### with SSR
When server rendering is enabled on your project, Nuxt image automatically detect image's file size and aspect ratio on the server side. Using this information `nuxt-image` will:

- Automatically calculates image size on the page and prevent [Cumulative Layout Shift](https://web.dev/cls/)
- Disable placeholder image If the file size of original image is smaller than treshold.

<alert type="warning">
Note: This behavior is dependent on the provider you are using for the image, If your provider does not provide image metadata these features will be disabled.
</alert>

### no SSR / SPA
Things are different when SSR is disabled. Nuxt Image could not calculate metadata of the image before the rendering process, therefore if you does specify a size for `nuxt-image`, you page layout will face [Cumulative Layout Shift](https://web.dev/cls/).  
If your does does not renders on the server side, it is highly recommended to specify a size for the `nuxt-image` to prevent cumulative layout shifting.

There are different ways to specify the size of the image:
- Use CSS styling to style the image size.
- Specify `width` and `height` props for the `nuxt-image` component, This way `nuxt-image` will calculate the aspect ratio of the image and preserve size of the image.

### Full Static
If you use Nuxt to generate full static websites, Image module will optimize your image and generates images statically. On the generate phase Image module will: 

- Detects available images in the static pages. If you used nuxt-images in non-static pages, those images will not be detect.
- Generates resized & optimized version of the image based on user preferences.
- Assign a small random name for every variation of the image and store it in the output directory.

The bahavior of `nuxt-image` for the generated images is similar to SSR mode, because the metadata of the image was calculated on the generate phase and stored in the payload of the page.  
On the other hand, the behavior of `nuxt-image` for the non-generated images will be same as [SPA mode](/how-it-works#no-ssr--spa).