---
title: Providers
description: ''
position: 5
category: Guide
---

Nuxt image have a generic way to work with external providers like Cloudinary. Here is a complete list of providers that supports out of the box.  
If you looking for a specific provider outside of this list, you can [create your own provider](/custom-provider).

## `cloudinary`

Integration between [Cloudinary](https://cloudinary.com) and the image module.  
To use this provider you just need to specify the base url of your project in cloudinary.

```js{}[nuxt.config.js]
export default {
  image: {
    providers: {
      cloudinary: {
        baseURL: 'https://res.cloudinary.com/nuxt/image/upload/'
      }
    }
  }
}
```

## `twicpics`

Integration between [Twicpics](https://www.twicpics.com) and the image module.  
To use this provider you just need to specify the base url of your project in Twicpics.

```js{}[nuxt.config.js]
export default {
  image: {
    providers: {
      twicpics: {
        baseURL: 'https://i5acur1u.twic.pics'
      }
    }
  }
}
```

## `fastly`

Integration between [Fastly](https://docs.fastly.com/en/guides/image-optimization-api)
and the image module. To use this provider you just need to specify the base url
of your service in Fastly.

```js{}[nuxt.config.js]
export default {
  image: {
    providers: {
      fastly: {
        baseURL: 'https://www.fastly.io'
      }
    }
  }
}
```

## `imgix`

Integration between [imgix](https://docs.imgix.com/) and the image module. To use this provider you just need to specify the base url of your service in imgix.

```js{}[nuxt.config.js]
export default {
  image: {
    providers: {
      imgix: {
        baseURL: 'https://assets.imgix.net'
      }
    }
  }
}
```
