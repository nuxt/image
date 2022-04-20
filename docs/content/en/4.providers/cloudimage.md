---
title: Cloudimage Provider
description: 'Nuxt Image has first class integration with Cloudimage'
navigation:
  title: Cloudimage
---

Integration between [Cloudimage](https://www.cloudimage.io/en/home) and the image module.

To use this provider you just need to specify the token of your project in cloudimage.

```js{}[nuxt.config.js]
export default {
  image: {
    cloudimage: {
      token: 'demo'
   }
  }
}
```
You can override default options:

## token

###### Type: **String** | Default: **"demo"** | _required_

Your Cloudimage customer token.
[Subscribe](https://www.cloudimage.io/en/register_page) for a
Cloudimage account to get one. The subscription takes less than a
minute and is totally free.

## baseURL

###### Type: **String** | _optional_

Your image folder on server; this alows to shorten your origin image URLs.

```js{}[nuxt.config.js]
export default {
  image: {
    cloudimage: {
      token: 'demo',
      baseURL: 'https://cdn.scaleflex.it/demo/' // optional
   }
  }
}
```
## doNotReplaceURL

###### Type: **bool** | Default: **false**

If set to **true**, the plugin will only add query parameters to the provided image source URL.

## apiVersion

###### Type: **String** | Default: **'v7'** | _optional_
Allow to use a specific version of API.

## Cloudimage modifiers

Beside the [standard modifiers](/components/nuxt-img#modifiers), also you can pass Cloudimage-specific [Cloudimage-specific transformation](https://docs.cloudimage.io/go/cloudimage-documentation-v7/en/introduction) params to `modifiers` prop.

## Cloudimage `fit` values

Beside [the standard values for `fit` property](/components/nuxt-img#fit) of Nuxt image and Nuxt picture, Cloudimage offers the following for extra resizing params:

* `crop` - Crops the image to specified dimensions (width and height) and keeps proportions.

* `face` - Crops the image automatically keeping the most prominent face.

* `fit` - Resizes the image to fit into a specified width and height box, adds padding (image or solid colour) to keep proportions.

* `cropfit` - Sets crop or fit resize mode depending on the origin and the desired dimensions.

* `bound` - Resizes to a given width and height box and keeps proportions. Similar to fit but without adding padding.

* `boundmin` - Resizes an image while bounding the smaller dimension to the desired width or height while keeping proportions.