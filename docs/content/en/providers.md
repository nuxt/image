---
title: Providers
description: 'Nuxt Image supports multiple providers for high performances.'
position: 103
category: 'Getting Started'
---

## Static Images

For static projects (`target: 'static'`) image module automatically optimizes `src` for both local and external assets via a preconfigured instance of [IPX](/providers/ipx) during development and generation (`nuxt genrate`) so you don't have to worry about choosing a hosting.

## Image Providers

When using server target (or serverless) and also for dynamic images which are not predictable during generation-time we need a rumtime image provider. Providers are an integration between the image module and images service providers. Using a specific provider means that your images are being transformed by the specific service URLs.
There are plenty of image service providers. Nuxt image have a generic way to work with external providers. Here is a complete list of providers that are supporteed out-of-the-box and can be easily configured to use.

If you are looking for a specific provider outside of this list, you can [create your own provider](/advanced/custom-provider).

- [`Cloudinary`](/providers/cloudinary)
- [`Fastly`](/providers/fastly)
- [`Imgix`](/providers/imgix)
- [`IPX`](/providers/ipx) (selfhosted)
- [`Twicpics`](/providers/twicpics)
