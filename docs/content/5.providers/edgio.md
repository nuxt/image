# Edgio

Optimize images with Edgio's optimization service

Edgio provides a simple HTTP service for optimizing images.

::alert{type="info"}
The image optimizer will only return an optimized image for mobile browsers. Desktop browsers are served the original image.
::

This integration works out of the box without need to configure!  See the [Documentation](https://docs.edg.io/guides/image_optimization) for more information.

**Example:**

```vue
<nuxt-img provider="edgio" src="https://i.imgur.com/LFtQeX2.jpeg" width="200" height="200" quality="80" />
```

## Modifiers

Edgio supports the following modifiers: `height`, `width` and `quality`

## Options

### `baseURL`

- Default: `https://opt.moovweb.net`
