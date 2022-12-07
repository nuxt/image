# Glide

Nuxt Image has first class integration with Glide

---

Integration between [Glide](https://glide.thephpleague.com/) and the image module.

To use this provider you just need to specify the base url of your service in glide.

```js{}[nuxt.config.js]
export default {
  image: {
    glide: {
      // baseURL of your laravel application
      baseURL: 'https://glide.herokuapp.com/1.0/'
    }
  }
}
```
