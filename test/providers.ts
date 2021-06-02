export const images = [
  {
    args: ['/test.png', {}],
    ipx: { url: '/_ipx/test.png' },
    cloudinary: { url: '/f_auto,q_auto/test' },
    twicpics: { url: '/test.png' },
    fastly: { url: '/test.png' },
    imgix: { url: '/test.png' },
    imagekit: { url: '/test.png' },
    netlify: { url: '/test.png' },
    prismic: { url: '/test.png?auto=compress,format&rect=0,0,200,200&w=100&h=100' },
    sanity: { url: 'https://cdn.sanity.io/images/projectid/production/test-300x450.png?auto=format' }
  },
  {
    args: ['/test.png', { width: 200 }],
    ipx: { url: '/_ipx/test.png?w=200' },
    cloudinary: { url: '/f_auto,q_auto,w_200/test' },
    twicpics: { url: '/test.png?twic=v1/cover=200x-' },
    fastly: { url: '/test.png?width=200' },
    imgix: { url: '/test.png?w=200' },
    imagekit: { url: '/test.png?tr=w-200' },
    netlify: { url: '/test.png?w=200&nf_resize=fit' },
    prismic: { url: '/test.png?auto=compress,format&rect=0,0,200,200&w=200&h=100' },
    sanity: { url: 'https://cdn.sanity.io/images/projectid/production/test-300x450.png?w=200&auto=format' }
  },
  {
    args: ['/test.png', { height: 200 }],
    ipx: { url: '/_ipx/test.png?h=200' },
    cloudinary: { url: '/f_auto,q_auto,h_200/test' },
    twicpics: { url: '/test.png?twic=v1/cover=-x200' },
    fastly: { url: '/test.png?height=200' },
    imgix: { url: '/test.png?h=200' },
    imagekit: { url: '/test.png?tr=h-200' },
    netlify: { url: '/test.png?h=200&nf_resize=fit' },
    prismic: { url: '/test.png?auto=compress,format&rect=0,0,200,200&w=100&h=200' },
    sanity: { url: 'https://cdn.sanity.io/images/projectid/production/test-300x450.png?h=200&auto=format' }
  },
  {
    args: ['/test.png', { width: 200, height: 200 }],
    ipx: { url: '/_ipx/test.png?s=200_200' },
    cloudinary: { url: '/f_auto,q_auto,w_200,h_200/test' },
    twicpics: { url: '/test.png?twic=v1/cover=200x200' },
    fastly: { url: '/test.png?width=200&height=200' },
    imgix: { url: '/test.png?w=200&h=200' },
    imagekit: { url: '/test.png?tr=w-200,h-200' },
    netlify: { url: '/test.png?w=200&h=200&nf_resize=fit' },
    prismic: { url: '/test.png?auto=compress,format&rect=0,0,200,200&w=200&h=200' },
    sanity: { url: 'https://cdn.sanity.io/images/projectid/production/test-300x450.png?w=200&h=200&auto=format' }
  },
  {
    args: ['/test.png', { width: 200, height: 200, fit: 'contain' }],
    ipx: { url: '/_ipx/test.png?fit=contain&s=200_200' },
    cloudinary: { url: '/f_auto,q_auto,w_200,h_200,c_scale/test' },
    twicpics: { url: '/test.png?twic=v1/contain=200x200' },
    fastly: { url: '/test.png?width=200&height=200&fit=bounds' },
    imgix: { url: '/test.png?w=200&h=200&fit=fill' },
    imagekit: { url: '/test.png?tr=w-200,h-200,cm-pad_resize' },
    netlify: { url: '/test.png?w=200&h=200&nf_resize=fit' },
    prismic: { url: '/test.png?auto=compress,format&rect=0,0,200,200&w=200&h=200&fit=fill' },
    sanity: { url: 'https://cdn.sanity.io/images/projectid/production/test-300x450.png?w=200&h=200&fit=fill&auto=format&bg=ffffff' }
  },
  {
    args: ['/test.png', { width: 200, height: 200, fit: 'contain', format: 'jpeg' }],
    ipx: { url: '/_ipx/test.png?fit=contain&f=jpeg&s=200_200' },
    cloudinary: { url: '/f_jpg,q_auto,w_200,h_200,c_scale/test' },
    twicpics: { url: '/test.png?twic=v1/output=jpeg/contain=200x200' },
    fastly: { url: '/test.png?width=200&height=200&fit=bounds&format=jpeg' },
    imgix: { url: '/test.png?w=200&h=200&fit=fill&fm=jpeg' },
    imagekit: { url: '/test.png?tr=w-200,h-200,cm-pad_resize,f-jpeg' },
    netlify: { url: '/test.png?w=200&h=200&nf_resize=fit' },
    prismic: { url: '/test.png?auto=compress,format&rect=0,0,200,200&w=200&h=200&fit=fill&fm=jpeg' },
    sanity: { url: 'https://cdn.sanity.io/images/projectid/production/test-300x450.png?w=200&h=200&fit=fill&fm=jpg&bg=ffffff' }
  }
] as const

export const modifierFixtures = images.map(image => image.args[1])
