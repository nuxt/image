# IPX

Built-in and self hosted image optimizer

---

Nuxt Image comes with a [preconfigured instance](/providers/introduction#default-provider) of [unjs/ipx](https://github.com/unjs/ipx). An open source, self-hosted image optimizer based on [lovell/sharp](https://github.com/lovell/sharp).

## Additional Modifiers

You can use [additional modifiers](https://github.com/unjs/ipx/#modifiers) supported by IPX.

**Example:**

```html
<nuxt-img src="/image.png" :modifiers="{ grayscale: true, tint: '#00DC82' }" />
```
