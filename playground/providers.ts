export interface Provider {
  name: string
  samples: {
    src: string,
    from?: string,
    link?: string,
    width?: number,
    height?: number,
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
        link: 'https://unsplash.com/@jeremythomasphoto?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText'
      },
      {
        src: '/images/everest.jpg',
        from: 'Mount Everest Wikipedia page (alias)',
        width: 300,
        height: 300,
        link: 'https://en.wikipedia.org/wiki/Mount_Everest'
      },
      {
        src: '/images/tacos.svg',
        from: 'Illustration from Icons8',
        width: 300,
        height: 300,
        link: 'https://icons8.com/illustrations/illustration/abstract-1419'
      },
      {
        src: '/unsplash/photo-1606112219348-204d7d8b94ee',
        from: 'Photo by Omid Armin',
        width: 300,
        height: 300,
        link: 'https://unsplash.com/@omidarmin?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText'
      }
    ]
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
        link: 'https://unsplash.com/@jeremythomasphoto?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText'
      },
      {
        src: '/images/everest.jpg',
        from: 'Mount Everest Wikipedia page (alias)',
        width: 300,
        height: 300,
        link: 'https://en.wikipedia.org/wiki/Mount_Everest'
      },
      {
        src: '/images/tacos.svg',
        from: 'Illustration from Icons8',
        width: 300,
        height: 300,
        link: 'https://icons8.com/illustrations/illustration/abstract-1419'
      },
      {
        src: '/unsplash/photo-1606112219348-204d7d8b94ee',
        from: 'Photo by Omid Armin',
        width: 300,
        height: 300,
        link: 'https://unsplash.com/@omidarmin?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText'
      }
    ]
  },
  // Cloudflare
  {
    name: 'cloudflare',
    samples: [
      {
        src: 'https://s3.that-test.site/burger.jpeg',
        height: 300,
        fit: 'contain'
      }
    ]
  },
  // Cloudinary
  {
    name: 'cloudinary',
    samples: [
      {
        src: '/remote/nuxt-org/blog/going-full-static/main'
      },
      {
        src: '/blog/going-full-static/main',
        width: 200,
        height: 200,
        fit: 'cropping'
      },
      {
        src: '/remote/nuxt-org/blog/going-full-static/main',
        width: 200,
        height: 200,
        fit: 'thumbnail',
        roundCorner: 'max'
      }
    ]
  },
  // Contentful
  {
    name: 'contentful',
    samples: [
      {
        src: '//images.ctfassets.net/fbr4i5aajb0w/6y0psij2o02YIwGScEo4kS/1b3f09b8fcedece1d17ea58417b55eb4/photo-1421986527537-888d998adb74.jpeg'
      },
      {
        src: '//images.ctfassets.net/fbr4i5aajb0w/6y0psij2o02YIwGScEo4kS/1b3f09b8fcedece1d17ea58417b55eb4/photo-1421986527537-888d998adb74.jpeg',
        width: 200,
        height: 133
      },
      {
        src: '//images.ctfassets.net/fbr4i5aajb0w/6y0psij2o02YIwGScEo4kS/1b3f09b8fcedece1d17ea58417b55eb4/photo-1421986527537-888d998adb74.jpeg',
        width: 200,
        height: 200,
        fit: 'contain'
      }
    ]
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
        format: 'webp'
      },
      {
        src: 'bag.jpg',
        width: 500,
        height: 500,
        fit: 'contain'
      },
      {
        src: 'boat.jpg',
        width: 800,
        height: 800,
        quality: 75,
        fit: 'cover'
      },
      {
        src: 'img.jpg',
        width: 300,
        height: 300,
        format: 'webp',
        fit: 'fill'
      }
    ]
  },
  // Fastly
  {
    name: 'fastly',
    samples: [
      { src: '/image.jpg' },
      { src: '/plant.jpeg' }
    ]
  },
  // ImageKit
  {
    name: 'imagekit',
    samples: [
      {
        src: '/girl.jpeg'
      },
      {
        src: '/girl.jpeg',
        width: 400,
        height: 300,
        fit: 'fill'
      },
      {
        src: '/girl.jpeg',
        width: 200,
        height: 300,
        modifiers: {
          focus: 'auto'
        }
      },
      {
        src: '/girl.jpeg',
        width: 150,
        height: 150,
        modifiers: {
          focus: 'face'
        }
      },
      {
        src: '/girl.jpeg',
        width: 150,
        height: 150,
        modifiers: {
          focus: 'face',
          radius: 'max'
        }
      }
    ]
  },
  // gumlet
  {
    name: 'gumlet',
    samples: [
      {
        src: '/sea.jpeg',
        width: 300,
        height: 300,
        fit: 'cover'
      }
    ]
  },
  // imgix
  {
    name: 'imgix',
    samples: [
      {
        src: 'blog/woman-hat.jpg',
        width: 300,
        height: 300,
        fit: 'cover'
      }
    ]
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
        modifiers: { metadata: 'true', sharpen: 10 }
      }
    ]
  },
  // Glide
  {
    name: 'glide',
    samples: [
      {
        src: '/kayaks.jpg',
        width: 1000,
        quality: 70,
        modifiers: { gam: 0.9, sharp: 8 }
      }
    ]
  },
  // Netlify
  {
    name: 'netlify',
    samples: [
      {
        src: '/images/apple.jpg',
        width: 101,
        fit: 'contain'
      },
      {
        src: '/images/apple.jpg',
        width: 200,
        height: 200,
        fit: 'fill'
      }
    ]
  },
  // Layer0
  {
    name: 'layer0',
    samples: [
      { src: 'https://i.imgur.com/LFtQeX2.jpeg', height: 200 },
      { src: 'https://i.imgur.com/LFtQeX2.jpeg', width: 50 },
      { src: 'https://i.imgur.com/LFtQeX2.jpeg', quality: 10 }
    ]
  },
  // Edgio
  {
    name: 'edgio',
    samples: [
      { src: 'https://i.imgur.com/LFtQeX2.jpeg', height: 200 },
      { src: 'https://i.imgur.com/LFtQeX2.jpeg', width: 50 },
      { src: 'https://i.imgur.com/LFtQeX2.jpeg', quality: 10 }
    ]
  },
  // Prepr
  {
    name: 'prepr',
    samples: [
      { src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg', quality: 5 },
      { src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg', height: 200 },
      { src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg', width: 200 },
      { src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg', width: 200, height: 200 },
      {
        src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg',
        modifiers: {
          w: 250,
          h: 250
        }
      },
      {
        src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg',
        width: 250,
        height: 200,
        modifiers: {
          crop: 'southeast'
        }
      },
      {
        src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg',
        width: 250,
        height: 200,
        modifiers: {
          crop: 'centre'
        }
      },
      {
        src: '4rhkcc7xzk7d-claymemoirscom-spider-pic.jpg',
        width: 250,
        height: 200,
        fit: 'cover'
      }
    ]
  },
  // Prismic
  {
    name: 'prismic',
    samples: [
      {
        src: 'https://images.prismic.io/200629-sms-hoy/f596a543-d593-4296-9abd-3d3ac15f1e39_ray-hennessy-mpw37yXc_WQ-unsplash.jpg?auto=compress,format&w=600&h=900'
      },
      {
        src: 'https://images.prismic.io/200629-sms-hoy/f596a543-d593-4296-9abd-3d3ac15f1e39_ray-hennessy-mpw37yXc_WQ-unsplash.jpg?auto=compress,format&w=600&h=900',
        width: 200
      },
      {
        src: 'https://images.prismic.io/200629-sms-hoy/f596a543-d593-4296-9abd-3d3ac15f1e39_ray-hennessy-mpw37yXc_WQ-unsplash.jpg?auto=compress,format&w=600&h=900',
        height: 200
      },
      {
        src: 'https://images.prismic.io/200629-sms-hoy/f596a543-d593-4296-9abd-3d3ac15f1e39_ray-hennessy-mpw37yXc_WQ-unsplash.jpg?auto=compress,format&w=600&h=900',
        width: 200,
        height: 200,
        fit: 'crop'
      }
    ]
  },
  // TwicPics
  {
    name: 'twicpics',
    samples: [
      {
        src: '/football.jpg'
      }, // basic
      {
        src: '/football.jpg',
        width: 501,
        height: 501,
        fit: 'cover'
      }, // cover
      {
        src: '/football.jpg',
        width: 501,
        height: 1001,
        fit: 'contain'
      }, // contain
      {
        src: '/football.jpg',
        width: 501,
        height: 1001,
        fit: 'fill'
      }, // fill
      {
        src: '/football.jpg',
        width: 501,
        height: 501,
        fit: 'inside'
      }, // inside
      {
        src: 'cat_1x1.jpg',
        width: 300,
        height: 600,
        fit: 'inside',
        background: 'red'
      }, // ratio
      {
        src: '/football.jpg',
        width: 501,
        height: 1001,
        fit: 'outside'
      }, // outside
      {
        src: '/icon-500.png',
        width: 501,
        background: 'red'
      }, // background transformation
      {
        src: '/peacock.jpg',
        width: 501,
        format: 'avif'
      }, // output format
      {
        src: '/peacock.jpg',
        width: 501,
        format: 'preview'
      }, // output format : mode preview
      {
        src: '/peacock.jpg',
        width: 501,
        format: 'maincolor'
      }, // output format : mode maincolor
      {
        src: '/peacock.jpg',
        width: 501,
        format: 'blank'
      }, // output format : blank
      {
        src: '/peacock.jpg',
        quality: 100
      }, // output quality : max
      {
        src: '/peacock.jpg',
        quality: 1
      }, // output quality : poor quality
      {
        src: '/woman-14.jpg'
      }, // original
      {
        src: '/woman-14.jpg',
        width: 501,
        height: 301,
        modifiers:
        {
          focus: 'auto'
        }
      }, // cover 501x301
      {
        src: '/woman-14.jpg',
        width: 501,
        fit: 'inside',
        modifiers:
        {
          focus: 'auto'
        }
      }, // inside width 501
      {
        src: 'cat_1x1.jpg',
        width: 300,
        fit: 'resize',
        modifiers:
        {
          cover: '4:3'
        }
      }, // ratio
      {
        src: '/cat.jpg',
        modifiers:
        {
          crop: '500x100'
        }
      }, // crop api
      {
        src: '/cat.jpg',
        width: 501,
        modifiers:
        {
          crop: '500x100@700x400'
        }
      }, // crop api with coordinates
      {
        src: '/cat.jpg',
        width: 501,
        modifiers:
        {
          focus: 'auto',
          crop: '500x100'
        }
      }, // crop api with focus auto
      {
        src: '/cat_1x1.jpg',
        modifiers:
        {
          focus: 'auto',
          crop: '500x500'
        }
      }, // crop api with focus auto
      {
        src: '/football.jpg',
        modifiers:
        {
          focus: 'auto',
          cover: '1:1'
        }
      }, // crop api with focus auto
      {
        src: '/puppy.jpg',
        width: 501,
        modifiers:
        {
          flip: 'both'
        }
      }, // flip api
      {
        src: '/peacock.jpg',
        format: 'png',
        modifiers:
        {
          truecolor: true
        }
      }, // truecolor api
      {
        src: '/peacock.jpg',
        format: 'png',
        modifiers:
        {
          truecolor: false
        }
      }, // truecolor api
      {
        src: '/man-13.jpg',
        format: 'png',
        modifiers:
        {
          turn: 'left'
        }
      }, // turn api
      {
        src: '/man-13.jpg',
        format: 'png',
        modifiers:
        {
          turn: 80
        }
      }, // turn api
      {
        src: '/man-13.jpg',
        format: 'png',
        modifiers:
        {
          turn: 90
        }
      }, // turn api
      {
        src: '/cherry-3.jpg',
        format: 'png',
        width: 501,
        modifiers:
        {
          focus: 'auto',
          zoom: 1.5
        }
      }, // zoom api
      {
        src: '/cherry-3.jpg',
        format: 'png',
        width: 501,
        modifiers:
        {
          focus: 'auto',
          zoom: 3
        }
      }, // zoom api
      {
        src: '/football.jpg',
        modifiers:
        {
          cover: '16:9',
          focus: 'auto',
          turn: 'left'
        }
      },
      {
        src: '/football.jpg',
        modifiers:
        {
          focus: 'auto',
          turn: 'left',
          cover: '16:9'
        }
      }
    ]
  },
  // Sanity
  {
    name: 'sanity',
    samples: [
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg'
      },
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg',
        width: 200,
        height: 200,
        fit: 'fill'
      },
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg',
        width: 200,
        height: 200,
        fit: 'cover'
      },
      {
        src: 'image-G3i4emG6B8JnTmGoN0UjgAp8-300x450-jpg',
        width: 200,
        height: 200,
        fit: 'contain'
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
            top: 0.009840969925995906
          },
          hotspot: {
            _type: 'sanity.imageHotspot',
            height: 0.6063612029601636,
            width: 0.21575342465753433,
            x: 0.4469178082191783,
            y: 0.32778302629507167
          }
        }
      }
    ]
  },
  // Strapi
  {
    name: 'strapi',
    samples: [
      {
        src: '/4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Image 1'
      },
      {
        src: '4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Thumbnail image',
        modifiers: { breakpoint: 'thumbnail' }
      },
      {
        src: '4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Small image',
        modifiers: { breakpoint: 'small' }
      },
      {
        src: '4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Medium image',
        modifiers: { breakpoint: 'medium' }
      },
      {
        src: '4d9z1eiyo2gmf6gd7xhp_823ae510e8.png',
        alt: 'Large image',
        modifiers: { breakpoint: 'large' }
      }
    ]
  },
  // Storyblok
  {
    name: 'storyblok',
    samples: [
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Original'
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Resized static',
        width: 500,
        height: 500
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Proportional to Width',
        width: 500
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Proportional to Height',
        height: 500
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Fit in with background CCCCCC',
        width: 200,
        height: 200,
        fit: 'in',
        filters: { fill: 'CCCCCC' }
      },
      {
        src: 'https://a.storyblok.com/f/39898/3310x2192/e4ec08624e/demo-image.jpeg',
        alt: 'Change image format',
        width: 200,
        format: 'webp'
      },
      {
        src: 'https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg',
        alt: 'Resized without Smart Crop',
        width: 600,
        height: 130
      },
      {
        src: 'https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg',
        alt: 'Resized with Smart Crop (Facial detection)',
        width: 600,
        height: 130,
        smart: true
      },
      {
        src: 'https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg',
        alt: 'Custom focal point (Focus on the bottom of the image)',
        width: 600,
        height: 130,
        operations: { filters: { focal: '450x500:550x600' } }
      },
      {
        src: 'https://a.storyblok.com/f/39898/2250x1500/c15735a73c/demo-image-human.jpeg',
        alt: 'Custom focal point (Focus on the top of the image)',
        width: 600,
        height: 130,
        operations: { filters: { focal: '450x0:550x100' } }
      }
    ]
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
        link: 'https://unsplash.com/@omidarmin?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText'
      },
      {
        src: 'https://images.unsplash.com/photo-1532236204992-f5e85c024202?crop=entropy&cs=tinysrgb&ixid=MnwxOTgwMDZ8MHwxfHNlYXJjaHwyOHx8dG9reW98ZW58MHx8fHwxNjczNzk3MDIz&w=500',
        width: 300,
        height: 300,
        fit: 'cover',
        quality: 75,
        format: 'auto',
        from: 'Photo by Jezael Melgoza',
        link: 'https://unsplash.com/@jezar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText'
      }
    ]
  },
  // Vercel
  {
    name: 'vercel',
    samples: [
      {
        src: 'colors.jpg',
        width: 750,
        quality: 75
      }
    ]
  },
  // Uploadcare
  {
    name: 'uploadcare',
    samples: [
      {
        src: 'c160afba-8b42-45a9-a46a-d393248b0072',
        width: 512,
        height: 512
      },
      {
        src: '4740215e-ed0f-478f-8dbd-4859d8ea4e60',
        width: 512
      },
      {
        src: '2e36710d-21ea-42b3-ac9e-3caa80f7e7bc',
        height: 512
      },
      {
        src: '678053e2-ad98-42be-8443-e114b8a1b294',
        width: 1080,
        height: 300,
        fit: 'cover'
      },
      {
        src: '034e80f0-14af-408a-9eae-1e233c361256',
        width: 1080,
        height: 300,
        fit: 'contain',
        modifiers: {
          setfill: '000000'
        }
      },
      {
        src: '6d7dd597-a829-4f03-a3cc-f87ff8a94d14',
        width: 1080,
        height: 300,
        fit: 'fill'
      },
      {
        src: 'beb68506-f5c3-4b85-8d8c-143ad62d5390',
        width: 1080,
        height: 300,
        fit: 'inside'
      },
      {
        src: '31e84033-f22e-4ed0-9462-76f9179e13e1',
        width: 1080,
        height: 300,
        fit: 'outside'
      }
    ]
  },
  // wagtail
  {
    name: 'wagtail',
    samples: [
      {
        alt: 'no specified width or height uses original maximum image size',
        src: '329944'
      },
      {
        alt: 'Resize',
        width: 600,
        height: 600,
        src: '329944'
      },
      {
        alt: 'Just width, height is proportional',
        width: 250,
        src: '329944'
      },
      {
        alt: 'Just height, width is proportional',
        height: 250,
        src: '329944'
      },
      {
        alt: 'Format to jpeg (webp{default}, jpeg, png)',
        width: 600,
        height: 600,
        format: 'jpeg',
        src: '329944'
      },
      {
        alt: 'low quality jpeg (quality default = 70)',
        width: 600,
        height: 600,
        format: 'jpeg',
        quality: 2,
        src: '329944'
      },
      {
        alt: 'Focus Zoom on the CMS assigned focal point of the image (0 - 100) CMS provided focal point is around the glass dorrs and 3 winddows on the very left of the house',
        width: 200,
        height: 200,
        src: '329944',
        modifiers:
        {
          focusZoom: 100
        }
      }
    ]
  },
  // Directus
  {
    name: 'directus',
    samples: [
      {
        src: 'ad514db1-eb90-4523-8183-46781437e7ee',
        alt: 'Image 1'
      },
      {
        src: 'ad514db1-eb90-4523-8183-46781437e7ee.jpg',
        alt: '1024px width',
        width: 1024,
        height: 256,
        fit: 'cover',
        modifiers: { withoutEnlargement: 'true' }
      },
      {
        src: 'ad514db1-eb90-4523-8183-46781437e7ee',
        alt: '256px width, webp',
        width: 256,
        format: 'webp'
      },
      {
        src: 'ad514db1-eb90-4523-8183-46781437e7ee',
        alt: '256px width, webp',
        width: 256,
        format: 'webp',
        modifiers: { withoutEnlargement: 'true', transforms: [['blur', 4], ['negate']] }
      }
    ]
  },
  // Sirv
  {
    name: 'sirv',
    samples: [
      {
        src: '/test.png',
        width: 750,
        quality: 75
      },
      {
        src: '/harris-large.jpg',
        width: 500,
        format: 'png'
      },
      {
        src: '/lacoste.jpg',
        width: 500,
        quality: 95,
        modifiers: { crop: 'trim' }
      },
      {
        src: '/look-big.jpg',
        height: 500,
        fit: 'contain'
      },
      {
        src: '/look-big.jpg',
        height: 500,
        modifiers: { crop: 'face' }
      },
      {
        src: '/QW.pdf',
        width: 500,
        modifiers: { pdfPage: 1 }
      },
      {
        src: '/look-big.jpg',
        height: 500,
        modifiers: { text: 'Hello', textAlign: 'center', textPositionGravity: 'south', textBackgroundColor: '#ffff', textSize: 60, textFontFamily: 'Arial', textColor: 'white' }
      },
      {
        src: 't-shirt-man.jpg',
        height: 500,
        modifiers: { watermark: '/watermark-v1.png', watermarkPosition: 'center', watermarkWidth: '30%' }
      }
    ]
  }
]
