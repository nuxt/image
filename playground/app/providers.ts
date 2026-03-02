import type { ImageProviders } from '@nuxt/image'

interface Provider {
  name: keyof ImageProviders
  samples: {
    src: string
    alt: string
    from?: string
    link?: string
    width?: number
    height?: number
    [key: string]: any
  }[]
}

export const providers: Provider[] = [
  // null provider (for non-node environments)
  {
    name: 'none',
    samples: [
      {
        src: '/images/colors.jpg',
        from: 'Jeremy Thomas',
        width: 300,
        height: 300,
        link: 'https://unsplash.com/@jeremythomasphoto?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText',
        alt: '',
      },
      {
        src: '/images/everest.jpg',
        from: 'Mount Everest Wikipedia page (alias)',
        width: 300,
        height: 300,
        link: 'https://en.wikipedia.org/wiki/Mount_Everest',
        alt: '',
      },
      {
        src: '/images/tacos.svg',
        from: 'Illustration from Icons8',
        width: 300,
        height: 300,
        link: 'https://icons8.com/illustrations/illustration/abstract-1419',
        alt: '',
      },
      {
        src: '/unsplash/photo-1606112219348-204d7d8b94ee',
        from: 'Photo by Omid Armin',
        width: 300,
        height: 300,
        link: 'https://unsplash.com/@omidarmin?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText',
        alt: '',
      },
    ],
  },
  // IPX
  {
    name: 'ipx',
    samples: [
      {
        src: '/images/colors.jpg',
        from: 'Jeremy Thomas',
        width: 300,
        height: 300,
        link: 'https://unsplash.com/@jeremythomasphoto?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText',
        alt: '',
      },
      {
        src: '/images/colors-layer.jpg',
        from: 'Jeremy Thomas',
        width: 300,
        height: 300,
        link: 'https://unsplash.com/@jeremythomasphoto?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText',
        alt: '',
      },
      {
        src: '/images/colors-layer-config.jpg',
        from: 'Jeremy Thomas',
        width: 300,
        height: 300,
        link: 'https://unsplash.com/@jeremythomasphoto?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText',
        alt: '',
      },
      {
        src: '/images/everest.jpg',
        from: 'Mount Everest Wikipedia page (alias)',
        width: 300,
        height: 300,
        link: 'https://en.wikipedia.org/wiki/Mount_Everest',
        alt: '',
      },
      {
        src: '/images/tacos.svg',
        from: 'Illustration from Icons8',
        width: 300,
        height: 300,
        link: 'https://icons8.com/illustrations/illustration/abstract-1419',
        alt: '',
      },
      {
        src: '/unsplash/photo-1606112219348-204d7d8b94ee',
        from: 'Photo by Omid Armin',
        width: 300,
        height: 300,
        link: 'https://unsplash.com/@omidarmin?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText',
        alt: '',
      },
    ],
  },
  // Aliyun
  {
    name: 'aliyun',
    samples: [
      {
        src: '/nuxt.png',
        height: 200,
        alt: '',
      },
      {
        src: '/nuxt.png',
        height: 300,
        width: 300,
        alt: '',
      },
      {
        src: '/nuxt.png',
        quality: 50,
        alt: '',
      },
      {
        src: '/nuxt.png',
        format: 'webp',
        quality: 80,
        modifiers: {
          resize: {
            fw: 900,
            fh: 200,
          },
        },
        alt: '',
      },
    ],
  },
  // AWS Amplify
  {
    name: 'awsAmplify',
    samples: [
      {
        src: '/test.jpg',
        width: 300,
        alt: '',
      },
    ],
  },
  // Builder.io
  {
    name: 'builderio',
    samples: [
      {
        src: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F869bfbaec9c64415ae68235d9b7b1425',
        alt: '',
      },
      {
        src: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F869bfbaec9c64415ae68235d9b7b1425',
        width: 450,
        height: 300,
        alt: '',
      },
      {
        src: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F869bfbaec9c64415ae68235d9b7b1425',
        width: 300,
        height: 300,
        format: 'webp',
        alt: '',
      },
      {
        src: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F869bfbaec9c64415ae68235d9b7b1425',
        width: 300,
        height: 300,
        fit: 'contain',
        format: 'webp',
        alt: '',
      },
      {
        src: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F869bfbaec9c64415ae68235d9b7b1425',
        width: 300,
        height: 300,
        fit: 'cover',
        format: 'webp',
        alt: '',
      },
      {
        src: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F869bfbaec9c64415ae68235d9b7b1425',
        width: 300,
        height: 300,
        fit: 'fill',
        format: 'webp',
        alt: '',
      },
      {
        src: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F869bfbaec9c64415ae68235d9b7b1425',
        width: 300,
        height: 300,
        format: 'webp',
        modifiers: {
          position: 'top',
        },
        alt: '',
      },
      {
        src: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F869bfbaec9c64415ae68235d9b7b1425',
        width: 300,
        height: 300,
        format: 'webp',
        modifiers: {
          position: 'left bottom',
        },
        alt: '',
      },
      {
        src: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F869bfbaec9c64415ae68235d9b7b1425',
        width: 300,
        height: 300,
        quality: 80,
        alt: '',
      },
      {
        src: 'https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F869bfbaec9c64415ae68235d9b7b1425',
        width: 300,
        height: 300,
        format: 'png',
        alt: '',
      },
    ],
  },
  // Bunny
  {
    name: 'bunny',
    samples: [
      {
        src: '/bunny1.jpg',
        width: 1000,
        quality: 80,
        modifiers: {
          sharpen: true,
          aspectRatio: '16:9',
        },
        alt: '',
      },
      {
        src: '/bunny2.jpg',
        modifiers: {
          crop: '750,750',
          crop_gravity: 'north',
        },
        alt: '',
      },
      {
        src: '/bunny3.jpg',
        modifiers: {
          flop: true,
          auto_optimize: 'high',
        },
        alt: '',
      },
    ],
  },
  // Cloudflare
  {
    name: 'cloudflare',
    samples: [
      {
        src: 'https://s3.that-test.site/burger.jpeg',
        height: 300,
        fit: 'contain',
        alt: '',
      },
    ],
  },
  // Cloudinary
  {
    name: 'cloudinary',
    samples: [
      {
        src: '/remote/nuxt-org/blog/going-full-static/main',
        alt: '',
      },
      {
        src: '/blog/going-full-static/main',
        width: 200,
        height: 200,
        fit: 'cropping',
        alt: '',
      },
      {
        src: '/remote/nuxt-org/blog/going-full-static/main',
        width: 200,
        height: 200,
        fit: 'thumbnail',
        roundCorner: 'max',
        alt: '',
      },
    ],
  },
  // Contentful
  {
    name: 'contentful',
    samples: [
      {
        src: '//images.ctfassets.net/fbr4i5aajb0w/6y0psij2o02YIwGScEo4kS/1b3f09b8fcedece1d17ea58417b55eb4/photo-1421986527537-888d998adb74.jpeg',
        alt: '',
      },
      {
        src: '//images.ctfassets.net/fbr4i5aajb0w/6y0psij2o02YIwGScEo4kS/1b3f09b8fcedece1d17ea58417b55eb4/photo-1421986527537-888d998adb74.jpeg',
        width: 200,
        height: 133,
        alt: '',
      },
      {
        src: '//images.ctfassets.net/fbr4i5aajb0w/6y0psij2o02YIwGScEo4kS/1b3f09b8fcedece1d17ea58417b55eb4/photo-1421986527537-888d998adb74.jpeg',
        width: 200,
        height: 200,
        fit: 'contain',
        alt: '',
      },
    ],
  },
  // Cloudimage
  {
    name: 'cloudimage',
    samples: [
      {
        src: 'https://2412819702-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FlIgyYELwJG6odLEyCM6i%2Fuploads%2FAHcbuKRYbIlBWO4cJ88b%2Fimage.png?alt=media&token=62ff753d-83eb-4e3f-932c-96eb72d455f1',
        width: 400,
        height: 250,
        densities: 'x1 x2',
        fit: 'contain',
        quality: 65,
        format: 'webp',
        alt: '',
      },
      {
        src: 'bag.jpg',
        width: 500,
        height: 500,
        fit: 'contain',
        alt: '',
      },
      {
        src: 'boat.jpg',
        width: 800,
        height: 800,
        quality: 75,
        fit: 'cover',
        alt: '',
      },
      {
        src: 'img.jpg',
        width: 300,
        height: 300,
        format: 'webp',
        fit: 'fill',
        alt: '',
      },
    ],
  },
  // Fastly
  {
    name: 'fastly',
    samples: [
      {
        src: '/image.jpg',
        alt: '',
      },
      {
        src: '/plant.jpeg',
        alt: '',
      },
    ],
  },
  // Filerobot
  {
    name: 'filerobot',
    samples: [
      {
        src: 'https://fesrinkeb.filerobot.com/monitoring3/boat-2023-03-06T15%3A03%3A12.6382894Z?vh=b3583b',
        width: 400,
        height: 250,
        densities: 'x1 x2',
        fit: 'contain',
        quality: 65,
        format: 'webp',
        alt: '',
      },
      {
        src: '/monitoring3/boat-2023-03-06T15%3A03%3A12.6382894Z?vh=b3583b',
        width: 500,
        height: 500,
        fit: 'contain',
        alt: '',
      },
      {
        src: '/monitoring3/boat-2023-03-06T15%3A03%3A12.6382894Z?vh=b3583b',
        width: 800,
        height: 800,
        quality: 75,
        fit: 'cover',
        alt: '',
      },
      {
        src: '/monitoring3/boat-2023-03-06T15%3A03%3A12.6382894Z?vh=b3583b',
        width: 300,
        height: 300,
        format: 'webp',
        fit: 'fill',
        alt: '',
      },
    ],
  },
  // ImageKit
  {
    name: 'imagekit',
    samples: [
      {
        src: '/girl.jpeg',
        alt: '',
      },
      {
        src: '/girl.jpeg',
        width: 400,
        height: 300,
        fit: 'fill',
        alt: '',
      },
      {
        src: '/girl.jpeg',
        width: 200,
        height: 300,
        modifiers: {
          focus: 'auto',
        },
        alt: '',
      },
      {
        src: '/girl.jpeg',
        width: 150,
        height: 150,
        modifiers: {
          focus: 'face',
        },
        alt: '',
      },
      {
        src: '/girl.jpeg',
        width: 150,
        height: 150,
        modifiers: {
          focus: 'face',
          radius: 'max',
        },
        alt: '',
      },
    ],
  },
  // GitHub
  {
    name: 'github',
    samples: [
      {
        src: 'npm',
        width: 50,
        height: 50,
        alt: '',
      },
      {
        src: 'nuxt',
        width: 50,
        height: 100,
        alt: '',
      },
      {
        src: 'unjs',
        alt: '',
      },
    ],
  },
  // gumlet
  {
    name: 'gumlet',
    samples: [
      {
        src: '/sea.jpeg',
        width: 300,
        height: 300,
        fit: 'cover',
        alt: '',
      },
    ],
  },
  // imgix
  {
    name: 'imgix',
    samples: [
      {
        src: 'blog/woman-hat.jpg',
        width: 300,
        height: 300,
        fit: 'cover',
        alt: '',
      },
    ],
  },
  // imageengine
  {
    name: 'imageengine',
    samples: [
      {
        src: '/images/image.jpg',
        width: 300,
        height: 300,
        fit: 'inside',
        modifiers: { metadata: 'true', sharpen: 10 },
        alt: '',
      },
    ],
  },
  // Glide
  {
    name: 'glide',
    samples: [
      {
        src: '/kayaks.jpg',
        width: 1000,
        quality: 70,
        modifiers: { gam: 0.9, sharp: 8 },
        alt: '',
      },
    ],
  },
  {
    name: 'netlifyImageCdn',
    samples: [
      {
        src: '/images/apple.jpg',
        width: 100,
        height: 100,
        fit: 'cover',
        alt: '',
      },
      {
        src: '/images/apple.jpg',
        width: 400,
        height: 300,
        alt: '',
      },
    ],
  },
  {
    name: 'netlifyLargeMedia',
    samples: [
      {
        src: '/images/apple.jpg',
        width: 101,
        fit: 'contain',
        alt: '',
      },
      {
        src: '/images/apple.jpg',
        width: 200,
        height: 200,
        fit: 'fill',
        alt: '',
      },
    ],
  },
  // Picsum (Lorem Picsum placeholder images)
  {
    name: 'picsum',
    samples: [
      {
        src: 'id/237',
        width: 200,
        height: 300,
        alt: '',
      },
      {
        src: 'id/870',
        width: 300,
        height: 200,
        modifiers: {
          grayscale: true,
        },
        alt: '',
      },
      {
        src: 'id/1025',
        width: 250,
        height: 250,
        modifiers: {
          blur: 5,
        },
        alt: '',
      },
      {
        src: 'seed/picsum',
        width: 200,
        height: 200,
        alt: '',
      },
    ],
  },
  // Prepr
  {
    name: 'prepr',
    samples: [
      {
        src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg',
        quality: 5,
        alt: '',
      },
      {
        src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg',
        height: 200,
        alt: '',
      },
      {
        src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg',
        width: 200,
        alt: '',
      },
      {
        src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg',
        width: 200,
        height: 200,
        alt: '',
      },
      {
        src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg',
        modifiers: {
          w: 250,
          h: 250,
        },
        alt: '',
      },
      {
        src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg',
        width: 250,
        height: 200,
        modifiers: {
          crop: 'southeast',
        },
        alt: '',
      },
      {
        src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg',
        width: 250,
        height: 200,
        modifiers: {
          crop: 'centre',
        },
        alt: '',
      },
      {
        src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg',
        width: 250,
        height: 200,
        fit: 'cover',
        alt: '',
      },
    ],
  },
  // Prismic
  {
    name: 'prismic',
    samples: [
      {
        src: 'https://images.prismic.io/200629-sms-hoy/f596a543-d593-4296-9abd-3d3ac15f1e39_ray-hennessy-mpw37yXc_WQ-unsplash.jpg?auto=compress,format&w=600&h=900',
        alt: '',
      },
      {
        src: 'https://images.prismic.io/200629-sms-hoy/f596a543-d593-4296-9abd-3d3ac15f1e39_ray-hennessy-mpw37yXc_WQ-unsplash.jpg?auto=compress,format&w=600&h=900',
        width: 200,
        alt: '',
      },
      {
        src: 'https://images.prismic.io/200629-sms-hoy/f596a543-d593-4296-9abd-3d3ac15f1e39_ray-hennessy-mpw37yXc_WQ-unsplash.jpg?auto=compress,format&w=600&h=900',
        height: 200,
        alt: '',
      },
      {
        src: 'https://images.prismic.io/200629-sms-hoy/f596a543-d593-4296-9abd-3d3ac15f1e39_ray-hennessy-mpw37yXc_WQ-unsplash.jpg?auto=compress,format&w=600&h=900',
        width: 200,
        height: 200,
        fit: 'crop',
        alt: '',
      },
    ],
  },
  // TwicPics
  {
    name: 'twicpics',
    samples: [
      {
        src: '/football.jpg',
        alt: '',
      }, // basic
      {
        src: '/football.jpg',
        width: 501,
        height: 501,
        fit: 'cover',
        alt: '',
      }, // cover
      {
        src: '/football.jpg',
        width: 501,
        height: 1001,
        fit: 'contain',
        alt: '',
      }, // contain
      {
        src: '/football.jpg',
        width: 501,
        height: 1001,
        fit: 'fill',
        alt: '',
      }, // fill
      {
        src: '/football.jpg',
        width: 501,
        height: 501,
        fit: 'inside',
        alt: '',
      }, // inside
      {
        src: 'cat_1x1.jpg',
        width: 300,
        height: 600,
        fit: 'inside',
        background: 'red',
        alt: '',
      }, // ratio
      {
        src: '/football.jpg',
        width: 501,
        height: 1001,
        fit: 'outside',
        alt: '',
      }, // outside
      {
        src: '/icon-500.png',
        width: 501,
        background: 'red',
        alt: '',
      }, // background transformation
      {
        src: '/peacock.jpg',
        width: 501,
        format: 'avif',
        alt: '',
      }, // output format
      {
        src: '/peacock.jpg',
        width: 501,
        format: 'preview',
        alt: '',
      }, // output format : mode preview
      {
        src: '/peacock.jpg',
        width: 501,
        format: 'maincolor',
        alt: '',
      }, // output format : mode maincolor
      {
        src: '/peacock.jpg',
        width: 501,
        format: 'blank',
        alt: '',
      }, // output format : blank
      {
        src: '/peacock.jpg',
        quality: 100,
        alt: '',
      }, // output quality : max
      {
        src: '/peacock.jpg',
        quality: 1,
        alt: '',
      }, // output quality : poor quality
      {
        src: '/woman-14.jpg',
        alt: '',
      }, // original
      {
        src: '/woman-14.jpg',
        width: 501,
        height: 301,
        modifiers:
        {
          focus: 'auto',
        },
        alt: '',
      }, // cover 501x301
      {
        src: '/woman-14.jpg',
        width: 501,
        fit: 'inside',
        modifiers:
        {
          focus: 'auto',
        },
        alt: '',
      }, // inside width 501
      {
        src: 'cat_1x1.jpg',
        width: 300,
        fit: 'resize',
        modifiers:
        {
          cover: '4:3',
        },
        alt: '',
      }, // ratio
      {
        src: '/cat.jpg',
        modifiers:
        {
          crop: '500x100',
        },
        alt: '',
      }, // crop api
      {
        src: '/cat.jpg',
        width: 501,
        modifiers:
        {
          crop: '500x100@700x400',
        },
        alt: '',
      }, // crop api with coordinates
      {
        src: '/cat.jpg',
        width: 501,
        modifiers:
        {
          focus: 'auto',
          crop: '500x100',
        },
        alt: '',
      }, // crop api with focus auto
      {
        src: '/cat_1x1.jpg',
        modifiers:
        {
          focus: 'auto',
          crop: '500x500',
        },
        alt: '',
      }, // crop api with focus auto
      {
        src: '/football.jpg',
        modifiers:
        {
          focus: 'auto',
          cover: '1:1',
        },
        alt: '',
      }, // crop api with focus auto
      {
        src: '/puppy.jpg',
        width: 501,
        modifiers:
        {
          flip: 'both',
        },
        alt: '',
      }, // flip api
      {
        src: '/peacock.jpg',
        format: 'png',
        modifiers:
        {
          truecolor: true,
        },
        alt: '',
      }, // truecolor api
      {
        src: '/peacock.jpg',
        format: 'png',
        modifiers:
        {
          truecolor: false,
        },
        alt: '',
      }, // truecolor api
      {
        src: '/man-13.jpg',
        format: 'png',
        modifiers:
        {
          turn: 'left',
        },
        alt: '',
      }, // turn api
      {
        src: '/man-13.jpg',
        format: 'png',
        modifiers:
        {
          turn: 80,
        },
        alt: '',
      }, // turn api
      {
        src: '/man-13.jpg',
        format: 'png',
        modifiers:
        {
          turn: 90,
        },
        alt: '',
      }, // turn api
      {
        src: '/cherry-3.jpg',
        format: 'png',
        width: 501,
        modifiers:
        {
          focus: 'auto',
          zoom: 1.5,
        },
        alt: '',
      }, // zoom api
      {
        src: '/cherry-3.jpg',
        format: 'png',
        width: 501,
        modifiers:
        {
          focus: 'auto',
          zoom: 3,
        },
        alt: '',
      }, // zoom api
      {
        src: '/football.jpg',
        modifiers:
        {
          cover: '16:9',
          focus: 'auto',
          turn: 'left',
        },
        alt: '',
      },
      {
        src: '/football.jpg',
        modifiers:
        {
          focus: 'auto',
          turn: 'left',
          cover: '16:9',
        },
        alt: '',
      },
    ],
  },
  // Sanity
  {
    name: 'sanity',
    samples: [
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg',
        alt: '',
      },
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg',
        width: 200,
        height: 200,
        fit: 'fill',
        alt: '',
      },
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg',
        width: 200,
        height: 200,
        fit: 'cover',
        alt: '',
      },
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg',
        width: 200,
        height: 200,
        fit: 'contain',
        alt: '',
      },
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg',
        width: 200,
        modifiers: {
          crop: {
            _type: 'sanity.imageCrop',
            bottom: 0.36903637222484653,
            left: 0.23801369863013686,
            right: 0,
            top: 0.009840969925995906,
          },
          hotspot: {
            _type: 'sanity.imageHotspot',
            height: 0.6063612029601636,
            width: 0.21575342465753433,
            x: 0.4469178082191783,
            y: 0.32778302629507167,
          },
        },
        alt: '',
      },
    ],
  },
  // Shopify
  {
    name: 'shopify',
    samples: [
      {
        src: 'https://cdn.shopify.com/static/sample-images/garnished.jpeg',
        alt: '',
      },
      {
        src: 'https://cdn.shopify.com/static/sample-images/garnished.jpeg',
        width: 450,
        height: 300,
        alt: '',
      },
      {
        src: 'https://cdn.shopify.com/static/sample-images/garnished.jpeg',
        width: 300,
        height: 300,
        modifiers: {
          padColor: 'ff0000',
        },
        alt: '',
      },
      {
        src: 'https://cdn.shopify.com/static/sample-images/garnished.jpeg',
        width: 300,
        height: 300,
        modifiers: {
          crop: 'center',
        },
        alt: '',
      },
      {
        src: 'https://cdn.shopify.com/static/sample-images/garnished.jpeg',
        width: 450,
        height: 150,
        modifiers: {
          crop: 'top',
        },
        alt: '',
      },
      {
        src: 'https://cdn.shopify.com/static/sample-images/garnished.jpeg',
        width: 450,
        height: 150,
        modifiers: {
          crop: 'bottom',
        },
        alt: '',
      },
      {
        src: 'https://cdn.shopify.com/static/sample-images/garnished.jpeg',
        width: 300,
        height: 450,
        modifiers: {
          crop: 'left',
        },
        alt: '',
      },
      {
        src: 'https://cdn.shopify.com/static/sample-images/garnished.jpeg',
        width: 300,
        height: 450,
        modifiers: {
          crop: 'right',
        },
        alt: '',
      },
      {
        src: 'https://cdn.shopify.com/static/sample-images/garnished.jpeg',
        modifiers: {
          crop: 'region',
          cropLeft: 100,
          cropTop: 100,
          cropWidth: 450,
          cropHeight: 300,
        },
        alt: '',
      },
      {
        src: 'https://cdn.shopify.com/static/sample-images/garnished.jpeg',
        width: 300,
        height: 300,
        format: 'png',
        alt: '',
      },
      {
        src: 'https://cdn.shopify.com/static/sample-images/garnished.jpeg',
        width: 300,
        height: 300,
        quality: 1,
        alt: '',
      },
    ],
  },
  // Strapi
  {
    name: 'strapi',
    samples: [
      {
        src: '/4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Image 1',
      },
      {
        src: '4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Thumbnail image',
        modifiers: { breakpoint: 'thumbnail' },
      },
      {
        src: '4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Small image',
        modifiers: { breakpoint: 'small' },
      },
      {
        src: '4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Medium image',
        modifiers: { breakpoint: 'medium' },
      },
      {
        src: '4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Large image',
        modifiers: { breakpoint: 'large' },
      },
    ],
  },
  // Strapi5
  {
    name: 'strapi5',
    samples: [
      {
        src: '/4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Image 1',
      },
      {
        src: '4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Thumbnail image',
        modifiers: { breakpoint: 'thumbnail' },
      },
      {
        src: '4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Small image',
        modifiers: { breakpoint: 'small' },
      },
      {
        src: '4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Medium image',
        modifiers: { breakpoint: 'medium' },
      },
      {
        src: '4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Large image',
        modifiers: { breakpoint: 'large' },
      },
    ],
  },
  // Storyblok
  {
    name: 'storyblok',
    samples: [
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Original',
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Resized static',
        width: 500,
        height: 500,
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Proportional to Width',
        width: 500,
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Proportional to Height',
        height: 500,
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Fit in with background CCCCCC',
        width: 200,
        height: 200,
        fit: 'in',
        filters: { fill: 'CCCCCC' },
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Change image format',
        width: 200,
        format: 'webp',
      },
      {
        src: 'https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg',
        alt: 'Resized without Smart Crop',
        width: 600,
        height: 130,
      },
      {
        src: 'https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg',
        alt: 'Resized with Smart Crop (Facial detection)',
        width: 600,
        height: 130,
        smart: true,
      },
      {
        src: 'https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg',
        alt: 'Custom focal point (Focus on the bottom of the image)',
        width: 600,
        height: 130,
        operations: { filters: { focal: '450x500:550x600' } },
      },
      {
        src: 'https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg',
        alt: 'Custom focal point (Focus on the top of the image)',
        width: 600,
        height: 130,
        operations: { filters: { focal: '450x0:550x100' } },
      },
    ],
  },
  // Supabase
  {
    name: 'supabase',
    samples: [
      {
        src: '/test.png',
        width: 300,
        height: 200,
        alt: '',
      },
      {
        src: '/test.png',
        width: 400,
        height: 300,
        quality: 80,
        alt: '',
      },
      {
        src: '/test.png',
        width: 500,
        height: 500,
        fit: 'cover',
        alt: '',
      },
    ],
  },
  // Unsplash
  {
    name: 'unsplash',
    samples: [
      {
        src: '/photo-1606112219348-204d7d8b94ee',
        width: 300,
        height: 300,
        fit: 'cover',
        quality: 75,
        format: 'auto',
        from: 'Photo by Omid Armin',
        link: 'https://unsplash.com/@omidarmin?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText',
        alt: '',
      },
      {
        src: 'https://images.unsplash.com/photo-1532236204992-f5e85c024202?crop=entropy&cs=tinysrgb&ixid=MnwxOTgwMDZ8MHwxfHNlYXJjaHwyOHx8dG9reW98ZW58MHx8fHwxNjczNzk3MDIz&w=500',
        width: 300,
        height: 300,
        fit: 'cover',
        quality: 75,
        format: 'auto',
        from: 'Photo by Jezael Melgoza',
        link: 'https://unsplash.com/@jezar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText',
        alt: '',
      },
    ],
  },
  // Vercel
  {
    name: 'vercel',
    samples: [
      {
        src: 'colors.jpg',
        width: 750,
        quality: 75,
        alt: '',
      },
    ],
  },
  // Uploadcare
  {
    name: 'uploadcare',
    samples: [
      {
        src: 'c160afba-8b42-45a9-a46a-d393248b0072',
        width: 512,
        height: 512,
        alt: '',
      },
      {
        src: '4740215e-ed0f-478f-8dbd-4859d8ea4e60',
        width: 512,
        alt: '',
      },
      {
        src: '2e36710d-21ea-42b3-ac9e-3caa80f7e7bc',
        height: 512,
        alt: '',
      },
      {
        src: '678053e2-ad98-42be-8443-e114b8a1b294',
        width: 1080,
        height: 300,
        fit: 'cover',
        alt: '',
      },
      {
        src: '034e80f0-14af-408a-9eae-1e233c361256',
        width: 1080,
        height: 300,
        fit: 'contain',
        modifiers: {
          setfill: '000000',
        },
        alt: '',
      },
      {
        src: '6d7dd597-a829-4f03-a3cc-f87ff8a94d14',
        width: 1080,
        height: 300,
        fit: 'fill',
        alt: '',
      },
      {
        src: 'beb68506-f5c3-4b85-8d8c-143ad62d5390',
        width: 1080,
        height: 300,
        fit: 'inside',
        alt: '',
      },
      {
        src: '31e84033-f22e-4ed0-9462-76f9179e13e1',
        width: 1080,
        height: 300,
        fit: 'outside',
        alt: '',
      },
    ],
  },
  // wagtail
  {
    name: 'wagtail',
    samples: [
      {
        alt: 'no specified width or height uses original maximum image size',
        src: '329944',
      },
      {
        alt: 'Resize',
        width: 600,
        height: 600,
        src: '329944',
      },
      {
        alt: 'Just width, height is proportional',
        width: 250,
        src: '329944',
      },
      {
        alt: 'Just height, width is proportional',
        height: 250,
        src: '329944',
      },
      {
        alt: 'Format to jpeg (webp{default}, jpeg, png)',
        width: 600,
        height: 600,
        format: 'jpeg',
        src: '329944',
      },
      {
        alt: 'low quality jpeg (quality default = 70)',
        width: 600,
        height: 600,
        format: 'jpeg',
        quality: 2,
        src: '329944',
      },
      {
        alt: 'Focus Zoom on the CMS assigned focal point of the image (0 - 100) CMS provided focal point is around the glass dorrs and 3 winddows on the very left of the house',
        width: 200,
        height: 200,
        src: '329944',
        modifiers:
        {
          focusZoom: 100,
        },
      },
    ],
  },
  // Directus
  {
    name: 'directus',
    samples: [
      {
        src: 'ad514db1-eb90-4523-8183-46781437e7ee',
        alt: 'Image 1',
      },
      {
        src: 'ad514db1-eb90-4523-8183-46781437e7ee.jpg',
        alt: '1024px width',
        width: 1024,
        height: 256,
        fit: 'cover',
        modifiers: { withoutEnlargement: 'true' },
      },
      {
        src: 'ad514db1-eb90-4523-8183-46781437e7ee',
        alt: '256px width, webp',
        width: 256,
        format: 'webp',
      },
      {
        src: 'ad514db1-eb90-4523-8183-46781437e7ee',
        alt: '256px width, webp',
        width: 256,
        format: 'webp',
        modifiers: { withoutEnlargement: 'true', transforms: [['blur', 4], ['negate']] },
      },
    ],
  },
  // weserv
  {
    name: 'weserv',
    samples: [
      {
        src: 'https://picsum.photos/200',
        format: 'webp',
        alt: '',
      },
      {
        src: 'https://picsum.photos/200',
        format: 'webp',
        modifiers: { mask: 'circle' },
        alt: '',
      },
      {
        src: 'https://picsum.photos/200',
        format: 'webp',
        modifiers: { mask: 'circle', filter: 'sepia' },
        alt: '',
      },
      {
        src: 'https://picsum.photos/200',
        format: 'webp',
        modifiers: { mask: 'circle', filter: 'sepia', quality: 80 },
        alt: '',
      },
    ],
  },
  // Sirv
  {
    name: 'sirv',
    samples: [
      {
        src: '/test.png',
        width: 750,
        quality: 75,
        alt: '',
      },
      {
        src: '/harris-large.jpg',
        width: 500,
        format: 'png',
        alt: '',
      },
      {
        src: '/lacoste.jpg',
        width: 500,
        quality: 95,
        modifiers: { crop: 'trim' },
        alt: '',
      },
      {
        src: '/look-big.jpg',
        height: 500,
        fit: 'contain',
        alt: '',
      },
      {
        src: '/look-big.jpg',
        height: 500,
        modifiers: { crop: 'face' },
        alt: '',
      },
      {
        src: '/QW.pdf',
        width: 500,
        modifiers: { pdfPage: 1 },
        alt: '',
      },
      {
        src: '/look-big.jpg',
        height: 500,
        modifiers: { text: 'Hello', textAlign: 'center', textPositionGravity: 'south', textBackgroundColor: '#ffff', textSize: 60, textFontFamily: 'Arial', textColor: 'white' },
        alt: '',
      },
      {
        src: 't-shirt-man.jpg',
        height: 500,
        modifiers: { watermark: '/watermark-v1.png', watermarkPosition: 'center', watermarkWidth: '30%' },
        alt: '',
      },
    ],
  },
  // Hygraph
  {
    name: 'hygraph',
    samples: [
      {
        src: 'https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/cltsrex89477t08unlckqx9ue',
        width: 500,
        height: 500,
        fit: 'crop',
        quality: 90,
        alt: '',
      },
      {
        src: 'https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/cltsrex89477t08unlckqx9ue',
        width: 500,
        fit: 'max',
        format: 'auto_image',
        alt: '',
      },
      {
        src: 'https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/cltsrex89477t08unlckqx9ue',
        width: 300,
        height: 300,
        fit: 'clip',
        format: 'jpeg',
        alt: '',
      },
    ],
  },
  // Caisy
  {
    name: 'caisy',
    samples: [
      {
        src: 'https://assets.caisy.io/assets/b76210be-a043-4989-98df-ecaf6c6e68d8/056c27e2-81f5-4cd3-b728-cef181dfe7dc/d83ea6f0-f90a-462c-aebd-b8bc615fdce0pexelsmiguelapadrinan1591056.jpg',
        width: 500,
        height: 500,
        quality: 90,
        alt: '',
      },
    ],
  },
]
