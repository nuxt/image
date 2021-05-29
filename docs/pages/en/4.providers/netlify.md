---
title: Netlify Provider
description: Optimize images with Netlify's dynamic image transformation service.
navigation:
  title: Netlify
---

Netlify offers dynamic image transformation for all JPEG, PNG, and GIF files you have set to be tracked with [Netlify Large Media](https://docs.netlify.com/large-media/overview/).

:::alert{type="warning"}
Before setting `provider: 'netlify'`, make sure you have followed the steps to enable [Netlify Large Media](https://docs.netlify.com/large-media/overview/).
:::

## Modifiers

In addition to `height` and `width`, the Netlify provider supports the following modifiers:

### `fit`

* **Default**: `contain`
* **Valid options**: `contain` (equivalent to `nf_resize=fit`) and `fill` (equivalent to `nf_resize=smartcrop`)
