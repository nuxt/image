---
title: Unsplash
description: Nuxt Image has first class integration with Unsplash
---

Integration between [Unsplash](https://unsplash.com/documentation#dynamically-resizable-images) and the image module. See [Unsplash License](https://unsplash.com/license) for what usage is permitted.

## Dynamically resizable images

Every image returned by the Unsplash API is a dynamic image URL, which means that it can be manipulated to create new transformations of the image by simply adjusting the query parameters of the image URL.

This enables resizing, cropping, compression, and changing the format of the image in realtime client-side, without any API calls.

Under the hood, Unsplash uses [Imgix](/providers/imgix), a powerful image manipulation service to provide dynamic image URLs.

## Supported parameters

Unsplash officially support the parameters:

`w, h`: for adjusting the width and height of a photo
`crop`: for applying cropping to the photo
`fm`: for converting image format
`auto=format`: for automatically choosing the optimal image format depending on user browser
`q`: for changing the compression quality when using lossy file formats
`fit`: for changing the fit of the image within the specified dimensions
`dpr`: for adjusting the device pixel ratio of the image
The other parameters offered by Imgix can be used, but we don’t officially support them and may remove support for them at any time in the future.

>💫 Tip
>The API returns image URLs containing an ixid parameter. All resizing and manipulations of image URLs must keep this parameter as it allows for your application to report photo views and be compliant with the API Guidelines.
