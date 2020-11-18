---
title: How it works
description: ''
position: 7
category: Guide
---

## Components behavior
The behavior of the Image module is different in the project based on deployment targets.  

### Server Side Rendering / SSR

#### `nuxt-picture`
When server rendering is enabled on your project, the Nuxt image automatically detects the image's file size and aspect ratio on the server-side. Using this information `nuxt-picture` will automatically calculates image size on the page and prevent [Cumulative Layout Shift](https://web.dev/cls/)

#### `nuxt-img`

This component is completly similar to `<img>` tag. It does not support placeholder and does not preserve aspect ratio.

### Client Side Rendering / no SSR

#### `nuxt-picture`
Things are different when SSR is disabled. Nuxt Image could not calculate metadata of the image before the rendering process, therefore if you do not specify a size for `nuxt-picture`, your page layout will face [Cumulative Layout Shift](https://web.dev/cls/).  
If your page does not render on the server-side, it is highly recommended to specify a size for the `nuxt-picture` to prevent cumulative layout shifting.

There are different ways to specify the size of the image:
- Use CSS styling to style the image size.
- Specify `width` and `height` props for the `nuxt-picture` component, This way `nuxt-picture` will calculate the aspect ratio of the image and preserve the size of the image.

#### `nuxt-img`

Because of its nature, `nuxt-img` will act same as the SSR

### Full Static
If you use Nuxt to generate full static websites, the Image module will optimize your image and generates images statically. On the generate phase Image module will: 

- Detects available images in the static pages. If you used nuxt-images in non-static pages, those images will not be detected.
- Generates resized & optimized version of the image based on user preferences.
- Assign a small random name for every variation of the image and store it in the output directory.

The behavior of `nuxt-img` & `nuxt-picture` for the generated images is similar to SSR mode because the metadata of the image was calculated on the generate phase and stored in the payload of the page.  
On the other hand, the behavior of `nuxt-img` & `nuxt-picture` for the non-generated images will be the same as [Client side rendering](/how-it-works#server-side-rendering--ssr).