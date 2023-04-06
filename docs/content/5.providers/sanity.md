# Sanity

Nuxt Image has first class integration with Sanity

Integration between [Sanity](https://www.sanity.io/docs/image-urls) and Nuxt Image.

To use this provider you just need to specify the `projectId` of your project in Sanity.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    sanity: {
      projectId: 'yourprojectid',
      // Defaults to 'production'
      // dataset: 'development'
    }
  }
})
```

## Modifiers

The Sanity provider supports a number of additional modifiers. For a full list, check out [the Sanity documentation](https://www.sanity.io/docs/image-urls). All of the modifiers mentioned in the Sanity docs are supported, with the following notes.

### Extra convenience modifiers

The following more readable modifiers are also supported:

- `background` - equivalent to `bg`
- `download` - equivalent to `dl`
- `sharpen` - equivalent to `sharp`
- `orientation` - equivalent to `or`
- `minHeight` or `min-height` - equivalent to `min-h`
- `maxHeight` or `max-height` - equivalent to `max-h`
- `minWidth` or `min-width` - equivalent to `min-w`
- `maxWidth` or `max-width` - equivalent to `max-w`
- `saturation` - equivalent to `sat`

### `fit`

In addition to the values specified in the Sanity docs, which are respected, the following options from the [default fit behavior](/components/nuxt-img#fit) are supported:

- `cover` - this will behave like the Sanity modifier `crop`
- `contain` - this will behave like the Sanity modifier `fill`, and defaults to filling with a white background. (You can specify your own background color with the `background` modifier.)
- `inside` - this will behave like the Sanity modifier `min`
- `outside` - this will behave like the Sanity modifier `max`
- `fill` - this will behave like the Sanity modifier `scale`

::alert{type="warning"}
For compatibility with other providers, `fit: fill` is equivalent to the Sanity parameter `?fit=scale`. If you need the Sanity `?fit=fill` behavior, use `fit: contain` instead.
::

### `format`

You can specify any of the formats suppored by Sanity. If this is omitted, the Sanity provider will default to `auto=format`.

### `crop` and `hotspot`

You can pass your Sanity crop and hotspot image data as modifiers and Nuxt Image will correctly generate the `rect`, `fp-x` and `fp-y` parameters for you.
