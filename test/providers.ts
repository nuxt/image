export const images = [
  {
    args: ['/test.png', {}],
    none: { url: '/test.png' },
    ipx: { url: '/_ipx/_/test.png' },
    aliyun: { url: '/test.png' },
    awsAmplify: { url: '/?url=%2Ftest.png&w=1536&q=100' },
    cloudflare: { url: '/test.png' },
    cloudinary: { url: '/f_auto,q_auto/test' },
    twicpics: { url: '/test.png' },
    fastly: { url: '/test.png' },
    glide: { url: '/test.png' },
    gumlet: { url: '/test.png' },
    imgix: { url: '/test.png' },
    imageengine: { url: '/test.png' },
    unsplash: { url: '/test.png' },
    imagekit: { url: '/test.png' },
    netlifyImageCdn: { url: '/.netlify/images?url=%2Ftest.png' },
    netlifyLargeMedia: { url: '/test.png' },
    prepr: { url: 'https://projectName.stream.prepr.io/image-test-300x450-png' },
    prismic: { url: '/test.png?auto=compress,format&rect=0,0,200,200&w=100&h=100' },
    sanity: { url: 'https://cdn.sanity.io/images/projectid/production/test-300x450.png?auto=format' },
    contentful: { url: '/test.png' },
    cloudimage: { url: 'https://demo.cloudimg.io/v7/test.png' },
    edgio: { url: 'https://opt.moovweb.net/?img=/test.png' },
    storyblok: { url: 'https://a.storyblok.com/test.png' },
    vercel: { url: '/_vercel/image?url=%2Ftest.png&w=1536&q=100' },
    wagtail: { url: '329944/original|format-webp|webpquality-70' },
    directus: { url: '/assets/1ac73658-8b62-4dea-b6da-529fbc9d01a4' },
    uploadcare: { url: 'https://ucarecdn.com/c160afba-8b42-45a9-a46a-d393248b0072/' },
    weserv: { url: 'https://wsrv.nl/?filename=test.png&we&url=https://my-website.com/test.png' },
    sirv: { url: 'https://demo.sirv.com/test.png' },
    hygraph: { url: 'https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/cltsrex89477t08unlckqx9ue' },
    caisy: { url: 'https://assets.caisy.io/assets/b76210be-a043-4989-98df-ecaf6c6e68d8/056c27e2-81f5-4cd3-b728-cef181dfe7dc/d83ea6f0-f90a-462c-aebd-b8bc615fdce0pexelsmiguelapadrinan1591056.jpg' },
    bunny: { url: 'https://bunnyoptimizerdemo.b-cdn.net' },
  },
  {
    args: ['/test.png', { width: 200 }],
    none: { url: '/test.png' },
    ipx: { url: '/_ipx/w_200/test.png' },
    aliyun: { url: '/test.png?image_process=resize,w_200' },
    awsAmplify: { url: '/?url=%2Ftest.png&w=320&q=100' },
    cloudflare: { url: '/cdn-cgi/image/w=200/test.png' },
    cloudinary: { url: '/f_auto,q_auto,w_200/test' },
    twicpics: { url: '/test.png?twic=v1/cover=200x-' },
    fastly: { url: '/test.png?width=200' },
    glide: { url: '/test.png?w=200' },
    gumlet: { url: '/test.png?w=200' },
    imgix: { url: '/test.png?w=200' },
    imageengine: { url: '/test.png?imgeng=/w_200' },
    unsplash: { url: '/test.png?w=200' },
    imagekit: { url: '/test.png?tr=w-200' },
    netlifyImageCdn: { url: '/.netlify/images?w=200&url=%2Ftest.png' },
    netlifyLargeMedia: { url: '/test.png?w=200&nf_resize=fit' },
    prepr: { url: 'https://projectName.stream.prepr.io/w_200/image-test-300x450-png' },
    prismic: { url: '/test.png?auto=compress,format&rect=0,0,200,200&w=200&h=100' },
    sanity: { url: 'https://cdn.sanity.io/images/projectid/production/test-300x450.png?w=200&auto=format' },
    contentful: { url: '/test.png?w=200' },
    cloudimage: { url: 'https://demo.cloudimg.io/v7/test.png?width=200' },
    edgio: { url: 'https://opt.moovweb.net/?img=/test.png&width=200' },
    storyblok: { url: 'https://a.storyblok.com/test.png/m/200x0' },
    vercel: { url: '/_vercel/image?url=%2Ftest.png&w=320&q=100' },
    wagtail: { url: '329944/width-200|format-webp|webpquality-70' },
    directus: { url: '/assets/1ac73658-8b62-4dea-b6da-529fbc9d01a4?width=200' },
    uploadcare: { url: 'https://ucarecdn.com/c160afba-8b42-45a9-a46a-d393248b0072/-/resize/200x/' },
    weserv: { url: 'https://wsrv.nl/?filename=test.png&we&w=200&url=https://my-website.com/test.png' },
    sirv: { url: 'https://demo.sirv.com/test.png?w=200' },
    hygraph: { url: 'https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/resize=width:200/auto_image/cltsrex89477t08unlckqx9ue' },
    caisy: { url: 'https://assets.caisy.io/assets/b76210be-a043-4989-98df-ecaf6c6e68d8/056c27e2-81f5-4cd3-b728-cef181dfe7dc/d83ea6f0-f90a-462c-aebd-b8bc615fdce0pexelsmiguelapadrinan1591056.jpg?w=200' },
    bunny: { url: 'https://bunnyoptimizerdemo.b-cdn.net?width=200' },
  },
  {
    args: ['/test.png', { height: 200 }],
    none: { url: '/test.png' },
    ipx: { url: '/_ipx/h_200/test.png' },
    aliyun: { url: '/test.png?image_process=resize,h_200' },
    awsAmplify: { url: '/?url=%2Ftest.png&w=1536&q=100' },
    cloudflare: { url: '/cdn-cgi/image/h=200/test.png' },
    cloudinary: { url: '/f_auto,q_auto,h_200/test' },
    twicpics: { url: '/test.png?twic=v1/cover=-x200' },
    fastly: { url: '/test.png?height=200' },
    glide: { url: '/test.png?h=200' },
    gumlet: { url: '/test.png?h=200' },
    imgix: { url: '/test.png?h=200' },
    imageengine: { url: '/test.png?imgeng=/h_200' },
    unsplash: { url: '/test.png?h=200' },
    imagekit: { url: '/test.png?tr=h-200' },
    netlifyImageCdn: { url: '/.netlify/images?h=200&url=%2Ftest.png' },
    netlifyLargeMedia: { url: '/test.png?h=200&nf_resize=fit' },
    prepr: { url: 'https://projectName.stream.prepr.io/h_200/image-test-300x450-png' },
    prismic: { url: '/test.png?auto=compress,format&rect=0,0,200,200&w=100&h=200' },
    sanity: { url: 'https://cdn.sanity.io/images/projectid/production/test-300x450.png?h=200&auto=format' },
    contentful: { url: '/test.png?h=200' },
    cloudimage: { url: 'https://demo.cloudimg.io/v7/test.png?height=200' },
    edgio: { url: 'https://opt.moovweb.net/?img=/test.png&height=200' },
    storyblok: { url: 'https://a.storyblok.com/test.png/m/0x200' },
    vercel: { url: '/_vercel/image?url=%2Ftest.png&w=1536&q=100' },
    wagtail: { url: '329944/height-200|format-webp|webpquality-70' },
    directus: { url: '/assets/1ac73658-8b62-4dea-b6da-529fbc9d01a4?height=200' },
    uploadcare: { url: 'https://ucarecdn.com/c160afba-8b42-45a9-a46a-d393248b0072/-/resize/x200/' },
    weserv: { url: 'https://wsrv.nl/?filename=test.png&we&h=200&url=https://my-website.com/test.png' },
    sirv: { url: 'https://demo.sirv.com/test.png?h=200' },
    hygraph: { url: 'https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/resize=height:200/auto_image/cltsrex89477t08unlckqx9ue' },
    caisy: { url: 'https://assets.caisy.io/assets/b76210be-a043-4989-98df-ecaf6c6e68d8/056c27e2-81f5-4cd3-b728-cef181dfe7dc/d83ea6f0-f90a-462c-aebd-b8bc615fdce0pexelsmiguelapadrinan1591056.jpg?h=200' },
    bunny: { url: 'https://bunnyoptimizerdemo.b-cdn.net?height=200' },
  },
  {
    args: ['/test.png', { width: 200, height: 200 }],
    none: { url: '/test.png' },
    ipx: { url: '/_ipx/s_200x200/test.png' },
    aliyun: { url: '/test.png?image_process=resize,fw_200,fh_200' },
    awsAmplify: { url: '/?url=%2Ftest.png&w=320&q=100' },
    cloudflare: { url: '/cdn-cgi/image/w=200,h=200/test.png' },
    cloudinary: { url: '/f_auto,q_auto,w_200,h_200/test' },
    twicpics: { url: '/test.png?twic=v1/cover=200x200' },
    fastly: { url: '/test.png?width=200&height=200' },
    glide: { url: '/test.png?w=200&h=200' },
    gumlet: { url: '/test.png?w=200&h=200' },
    imgix: { url: '/test.png?w=200&h=200' },
    imageengine: { url: '/test.png?imgeng=/w_200/h_200' },
    unsplash: { url: '/test.png?w=200&h=200' },
    imagekit: { url: '/test.png?tr=w-200,h-200' },
    netlifyImageCdn: { url: '/.netlify/images?w=200&h=200&url=%2Ftest.png' },
    netlifyLargeMedia: { url: '/test.png?w=200&h=200&nf_resize=fit' },
    prismic: { url: '/test.png?auto=compress,format&rect=0,0,200,200&w=200&h=200' },
    prepr: { url: 'https://projectName.stream.prepr.io/w_200,h_200/image-test-300x450-png' },
    sanity: { url: 'https://cdn.sanity.io/images/projectid/production/test-300x450.png?w=200&h=200&auto=format' },
    contentful: { url: '/test.png?w=200&h=200' },
    cloudimage: { url: 'https://demo.cloudimg.io/v7/test.png?width=200&height=200' },
    edgio: { url: 'https://opt.moovweb.net/?img=/test.png&width=200&height=200' },
    storyblok: { url: 'https://a.storyblok.com/test.png/m/200x200' },
    vercel: { url: '/_vercel/image?url=%2Ftest.png&w=320&q=100' },
    wagtail: { url: '329944/fill-200x200-c0|format-webp|webpquality-70' },
    directus: { url: '/assets/1ac73658-8b62-4dea-b6da-529fbc9d01a4?width=200&height=200' },
    uploadcare: { url: 'https://ucarecdn.com/c160afba-8b42-45a9-a46a-d393248b0072/-/resize/200x200/' },
    weserv: { url: 'https://wsrv.nl/?filename=test.png&we&w=200&h=200&url=https://my-website.com/test.png' },
    sirv: { url: 'https://demo.sirv.com/test.png?w=200&h=200' },
    hygraph: { url: 'https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/resize=width:200,height:200/auto_image/cltsrex89477t08unlckqx9ue' },
    caisy: { url: 'https://assets.caisy.io/assets/b76210be-a043-4989-98df-ecaf6c6e68d8/056c27e2-81f5-4cd3-b728-cef181dfe7dc/d83ea6f0-f90a-462c-aebd-b8bc615fdce0pexelsmiguelapadrinan1591056.jpg?w=200&h=200' },
    bunny: { url: 'https://bunnyoptimizerdemo.b-cdn.net?width=200&height=200' },
  },
  {
    args: ['/test.png', { width: 200, height: 200, fit: 'contain' }],
    none: { url: '/test.png' },
    ipx: { url: '/_ipx/fit_contain&s_200x200/test.png' },
    aliyun: { url: '/test.png?image_process=fit,contain/resize,fw_200,fh_200' },
    awsAmplify: { url: '/?url=%2Ftest.png&w=320&q=100' },
    cloudflare: { url: '/cdn-cgi/image/w=200,h=200,fit=contain/test.png' },
    cloudinary: { url: '/f_auto,q_auto,w_200,h_200,c_scale/test' },
    twicpics: { url: '/test.png?twic=v1/inside=200x200' },
    fastly: { url: '/test.png?width=200&height=200&fit=bounds' },
    glide: { url: '/test.png?w=200&h=200&fit=contain' },
    gumlet: { url: '/test.png?w=200&h=200&fit=fill' },
    imgix: { url: '/test.png?w=200&h=200&fit=fill' },
    imageengine: { url: '/test.png?imgeng=/w_200/h_200/m_letterbox' },
    unsplash: { url: '/test.png?w=200&h=200&fit=fill' },
    imagekit: { url: '/test.png?tr=w-200,h-200,cm-pad_resize' },
    netlifyImageCdn: { url: '/.netlify/images?w=200&h=200&fit=contain&url=%2Ftest.png' },
    netlifyLargeMedia: { url: '/test.png?w=200&h=200&nf_resize=fit' },
    prismic: { url: '/test.png?auto=compress,format&rect=0,0,200,200&w=200&h=200&fit=fill' },
    prepr: { url: 'https://projectName.stream.prepr.io/w_200,h_200,fit_contain/image-test-300x450-png' },
    sanity: { url: 'https://cdn.sanity.io/images/projectid/production/test-300x450.png?w=200&h=200&fit=fill&auto=format&bg=ffffff' },
    contentful: { url: '/test.png?w=200&h=200&fit=fill' },
    cloudimage: { url: 'https://demo.cloudimg.io/v7/test.png?width=200&height=200&func=fit' },
    edgio: { url: 'https://opt.moovweb.net/?img=/test.png&width=200&height=200&fit=contain' },
    storyblok: { url: 'https://a.storyblok.com/test.png/m/fit-contain/200x200' },
    vercel: { url: '/_vercel/image?url=%2Ftest.png&w=320&q=100' },
    wagtail: { url: '329944/fill-200x200-c0|format-webp|webpquality-70' },
    directus: { url: '/assets/1ac73658-8b62-4dea-b6da-529fbc9d01a4?width=200&height=200&fit=contain' },
    uploadcare: { url: 'https://ucarecdn.com/c160afba-8b42-45a9-a46a-d393248b0072/-/resize/200x200/-/stretch/off/' },
    weserv: { url: 'https://wsrv.nl/?filename=test.png&we&w=200&h=200&fit=contain&url=https://my-website.com/test.png' },
    sirv: { url: 'https://demo.sirv.com/test.png?w=200&h=200&scale.option=fit' },
    hygraph: { url: 'https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/resize=width:200,height:200,fit:max/auto_image/cltsrex89477t08unlckqx9ue' },
    caisy: { url: 'https://assets.caisy.io/assets/b76210be-a043-4989-98df-ecaf6c6e68d8/056c27e2-81f5-4cd3-b728-cef181dfe7dc/d83ea6f0-f90a-462c-aebd-b8bc615fdce0pexelsmiguelapadrinan1591056.jpg?w=200&h=200' },
    bunny: { url: 'https://bunnyoptimizerdemo.b-cdn.net?width=200&height=200' },
  },
  {
    args: ['/test.png', { width: 200, height: 200, fit: 'contain', format: 'jpeg' }],
    none: { url: '/test.png' },
    ipx: { url: '/_ipx/fit_contain&f_jpeg&s_200x200/test.png' },
    aliyun: { url: '/test.png?image_process=fit,contain/format,jpeg/resize,fw_200,fh_200' },
    awsAmplify: { url: '/?url=%2Ftest.png&w=320&q=100' },
    cloudflare: { url: '/cdn-cgi/image/w=200,h=200,fit=contain,f=jpeg/test.png' },
    cloudinary: { url: '/f_jpg,q_auto,w_200,h_200,c_scale/test' },
    twicpics: { url: '/test.png?twic=v1/output=jpeg/inside=200x200' },
    fastly: { url: '/test.png?width=200&height=200&fit=bounds&format=jpeg' },
    glide: { url: '/test.png?w=200&h=200&fit=contain&fm=jpeg' },
    gumlet: { url: '/test.png?w=200&h=200&fit=fill&format=jpeg' },
    imgix: { url: '/test.png?w=200&h=200&fit=fill&fm=jpeg' },
    imageengine: { url: '/test.png?imgeng=/w_200/h_200/m_letterbox/f_jpg' },
    unsplash: { url: '/test.png?w=200&h=200&fit=fill&fm=jpeg' },
    imagekit: { url: '/test.png?tr=w-200,h-200,cm-pad_resize,f-jpeg' },
    netlifyImageCdn: { url: '/.netlify/images?w=200&h=200&fit=contain&fm=jpg&url=%2Ftest.png' },
    netlifyLargeMedia: { url: '/test.png?w=200&h=200&nf_resize=fit' },
    prismic: { url: '/test.png?auto=compress,format&rect=0,0,200,200&w=200&h=200&fit=fill&fm=jpeg' },
    sanity: { url: 'https://cdn.sanity.io/images/projectid/production/test-300x450.png?w=200&h=200&fit=fill&fm=jpg&bg=ffffff' },
    prepr: { url: 'https://projectName.stream.prepr.io/w_200,h_200,fit_contain,format_jpg/image-test-300x450-png' },
    contentful: { url: '/test.png?w=200&h=200&fit=fill&fm=jpg' },
    cloudimage: { url: 'https://demo.cloudimg.io/v7/test.png?width=200&height=200&func=fit&force_format=jpeg' },
    edgio: { url: 'https://opt.moovweb.net/?img=/test.png&width=200&height=200&fit=contain&format=jpeg' },
    storyblok: { url: 'https://a.storyblok.com/test.png/m/fit-contain/200x200/filters:format(jpeg)' },
    vercel: { url: '/_vercel/image?url=%2Ftest.png&w=320&q=100' },
    wagtail: { url: '329944/fill-200x200-c0|format-jpeg|jpegquality-70' },
    directus: { url: '/assets/1ac73658-8b62-4dea-b6da-529fbc9d01a4?width=200&height=200&fit=contain&format=jpg' },
    uploadcare: { url: 'https://ucarecdn.com/c160afba-8b42-45a9-a46a-d393248b0072/-/format/jpeg/-/resize/200x200/-/stretch/off/' },
    weserv: { url: 'https://wsrv.nl/?filename=test.png&we&w=200&h=200&fit=contain&output=jpg&url=https://my-website.com/test.png' },
    sirv: { url: 'https://demo.sirv.com/test.png?w=200&h=200&scale.option=fit&format=jpg' },
    hygraph: { url: 'https://eu-central-1-shared-euc1-02.graphassets.com/cltsj3mii0pvd07vwb5cyh1ig/resize=width:200,height:200,fit:max/output=format:jpg/cltsrex89477t08unlckqx9ue' },
    caisy: { url: 'https://assets.caisy.io/assets/b76210be-a043-4989-98df-ecaf6c6e68d8/056c27e2-81f5-4cd3-b728-cef181dfe7dc/d83ea6f0-f90a-462c-aebd-b8bc615fdce0pexelsmiguelapadrinan1591056.jpg?w=200&h=200' },
    bunny: { url: 'https://bunnyoptimizerdemo.b-cdn.net?width=200&height=200' },
  },
] as const

export const modifierFixtures = images.map(image => image.args[1])
