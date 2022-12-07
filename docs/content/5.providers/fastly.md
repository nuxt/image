# Fastly

Nuxt Image has first class integration with Fastly

---

Integration between [Fastly](https://docs.fastly.com/en/guides/image-optimization-api) and the image module.

To use this provider you just need to specify the base url of your service in Fastly.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    fastly: {
      baseURL: 'https://www.fastly.io'
    }
  }
})
```
