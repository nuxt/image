# Layer0

Optimize images with Layer0's optimization service

---

Layer0 provides a simple HTTP service for optimizing images.

::alert{type="info"}
The image optimizer will only return an optimized image for mobile browsers. Desktop browsers are served the original image.
::

This integration works out of the box without need to configure!  See the [Documentation](https://docs.layer0.co/guides/image_optimization) for more information.

**Example:**

```vue
<nuxt-img provider="layer0" src="https://i.imgur.com/LFtQeX2.jpeg" width="200" height="200" quality="80" />
```

## Modifiers

Layer0 supports the following modifiers: `height`, `width` and `quality`

## Options

### `baseURL`

- Defalt: `https://opt.moovweb.net`
