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
  // IPX
  {
    name: 'static',
    samples: [
      {
        src: '/images/colors.jpg',
        from: 'Jeremy Thomas',
        link: 'https://unsplash.com/@jeremythomasphoto?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText'
      },
      {
        src: '/images/everest.jpg',
        from: 'Mount Everest Wikipedia page',
        link: 'https://en.wikipedia.org/wiki/Mount_Everest'
      },
      {
        src: '/images/tacos.svg',
        from: 'Illustration from Icons8',
        link: 'https://icons8.com/illustrations/illustration/abstract-1419'
      },
      {
        src: 'https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1940&q=80',
        from: 'Photo by Omid Armin',
        link: 'https://unsplash.com/@omidarmin?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText'
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
        src: '/remote/nuxt-org/blog/going-full-static/main',
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
  // Fastly
  {
    name: 'fastly',
    samples: [
      { src: '/image.jpg' },
      { src: '/plant.jpeg' }
    ]
  },
  // Glide
  {
    name: 'glide',
    samples: [
      { src: '/zs77ih', width: 720, quality: 70 }
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
      { src: '/football.jpg' },
      { src: '/football.jpg', width: 250, height: 400, focus: 'auto' }
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
  }
]
