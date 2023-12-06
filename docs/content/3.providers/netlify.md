---
title: Netlify
description: Optimize images with Netlify's dynamic image transformation service.
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/image/blob/main/src/runtime/providers/netlify.ts
    size: xs
---

> ❗ Deprecated
> Netlify’s Large Media service is [deprecated](https://answers.netlify.com/t/large-media-feature-deprecated-but-not-removed/100804). If this feature is already enabled, Large Media will continue to work on these sites as usual. New Large Media configuration is not recommended.

Netlify offers dynamic image transformation for all JPEG, PNG, and GIF files you have set to be tracked with [Netlify Large Media](https://docs.netlify.com/large-media/overview/).

::callout
Before setting `provider: 'netlify'`, make sure you have followed the steps to enable [Netlify Large Media](https://docs.netlify.com/large-media/overview/).
::

## Modifiers

In addition to `height` and `width`, the Netlify provider supports the following modifiers:

### `fit`

* **Default**: `contain`
* **Valid options**: `contain` (equivalent to `nf_resize=fit`) and `fill` (equivalent to `nf_resize=smartcrop`)
