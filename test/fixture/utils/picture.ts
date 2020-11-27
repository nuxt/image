require('jsdom-global')()
const { mount } = require('@vue/test-utils')

export function testComponent (Component, props) {
  const isLazy = props.loading === 'lazy'
  let observerAdded = 0
  let observerDestroyed = 0
  let becomeVisible = null
  let src = '/image.png'
  function $img () {
    return src
  }
  const eventType = { intersect: 'onIntersect' }
  $img.getResolution = () => {
    return {
      width: 200,
      height: 200
    }
  }
  $img.sizes = () => {
    return [{
      width: 200,
      url: src
    }, {
      width: 500,
      media: '(min-width: 500px)',
      url: src
    }, {
      width: 900,
      media: '(min-width: 900px)',
      format: 'webp',
      url: src
    }]
  }
  $img.$observer = {
    add (_, callback) {
      observerAdded += 1
      becomeVisible = () => callback(eventType.intersect)
    },
    remove () {
      observerDestroyed += 1
    }
  }
  $img.getPlaceholder = () => `/placeholder${src}`
  let wrapper
  test('Mount', () => {
    // render the component
    wrapper = mount({
      inject: ['$img'],
      ...Component
    }, {
      propsData: {
        ...props,
        src
      },
      provide: {
        $img
      }
    })
  })
  test('add observer', () => {
    expect(observerAdded).toBe(isLazy ? 1 : 0)
    expect(observerDestroyed).toBe(0)
  })
  test('Set src', (done) => {
    if (!isLazy) {
      const domSrcBefore = wrapper.find('.__nim_o').element.getAttribute('src')
      expect(domSrcBefore).toEqual(src)
      return done()
    }
    const domElement = wrapper.find('.__nim_o').element
    expect(domElement).toBeUndefined()
    becomeVisible()
    process.nextTick(() => {
      const domSrcAfter = wrapper.find('.__nim_o').element.getAttribute('src')
      expect(domSrcAfter).toEqual(src)
      done()
    })
  })
  test('Generate alt', () => {
    expect(wrapper.vm.imgAttributes.alt).toEqual('image')
    const domAlt = wrapper.find('.__nim_o').element.getAttribute('alt')
    expect(domAlt).toEqual('image')
  })

  test('Change src', (done) => {
    const domSrcBefore = wrapper.find('.__nim_o').element.getAttribute('src')
    expect(domSrcBefore).toEqual(src)
    src = '/image.jpeg'
    wrapper.setProps({ src })
    process.nextTick(() => {
      expect(observerAdded).toBe(isLazy ? 2 : 0)
      expect(observerDestroyed).toBe(isLazy ? 1 : 0)

      const domSrcAfter = wrapper.find('.__nim_o').element.getAttribute('src')
      expect(domSrcAfter).toEqual(src)
      done()
    })
  })

  test('sets', () => {
    if (Component.name === 'NuxtImg') {
      testImageSets(wrapper)
    } else if (Component.name === 'NuxtPicture') {
      testPictureSets(wrapper)
    }
  })

  test('noscript', () => {
    const noscript = wrapper.find('noscript')
    expect(noscript.exists()).toBe(!!props.noScript)
  })

  test('remove observer', () => {
    wrapper.destroy()
    expect(observerDestroyed).toBe(isLazy ? 2 : 0)
  })
}

function testImageSets (wrapper) {
  const possibleSizes = [
    '(min-width: 900px) 900px, (min-width: 500px) 500px, 200px',
    '200px'
  ]
  const sizes = wrapper.find('.nuxt-img').element.getAttribute('sizes')
  expect(possibleSizes).toContain(sizes)
}

function testPictureSets (wrapper) {
  expect(wrapper.find('[media="(min-width: 900px)"]').exists()).toBe(true)
  expect(wrapper.find('[media="(min-width: 500px)"]').exists()).toBe(true)
  expect(wrapper.find('[type="webp"]').exists()).toBe(true)
}
