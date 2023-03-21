# Cloudinary

Nuxt Image has first class integration with Cloudinary

Integration between [Cloudinary](https://cloudinary.com) and the image module.

To use this provider you just need to specify the base url of your project in cloudinary.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/<your-cloud-name>/image/upload/'
    }
  }
})
```

## Remote Images

To handle remote image data, you can either use [fetch](https://cloudinary.com/documentation/fetch_remote_images#remote_image_fetch_url) or [upload](https://cloudinary.com/documentation/fetch_remote_images#auto_upload_remote_resources).

Consult the cloudinary [documentation](https://cloudinary.com/documentation/fetch_remote_images#comparing_fetch_to_auto_upload) for the difference between the two.

### Fetch

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/<your-cloud-name>/image/fetch/'
    }
  }
})
```

```vue
<NuxtImg provider="cloudinary" src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg" width="300" height="200" />
```

Note: You will need to configure your "Allowed fetch domains" to do the above.

### Upload

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/<your-cloud-name>/image/upload/<mapping-folder>'
    }
  }
})
```

```vue
<NuxtImg provider="cloudinary" src="/commons/a/ae/Olympic_flag.jpg" width="300" height="200" />
```

Note: You will need to configure your "Auto upload mapping" to do the above.

## Cloudinary modifiers

This provider uses [Cloudinary URL Loader](https://github.com/colbyfayock/cloudinary-util/tree/main/packages/url-loader) that allows you to pass the modifiers as props to your `<nuxt-img />` component like following:

```vue
<nuxt-img
  provider="cloudinary"
  src="/remote/nuxt-org/blog/going-full-static/main.png"
  width="300"
  :modifiers="{
    zoom: 0.5,
    grayscale: true,
    overlays: [{
      width: 2670 - 20,
      crop: 'fit',
      position: {
        x: 10,
        y: 10,
        gravity: 'north_west',
      },
      text: {
        color: 'blueviolet',
        fontFamily: 'Source Sans Pro',
        fontSize: 160,
        fontWeight: 'bold',
        textDecoration: 'underline',
        letterSpacing: 14,
        text: 'Cool Beans'
      }
    }]
  }"
/>
```

You can check all available modifiers in the official NextCloudinary documentation [here](https://next-cloudinary.spacejelly.dev/components/cldimage/configuration).
