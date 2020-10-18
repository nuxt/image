require('jsdom-global')()
const { mount } = require('@vue/test-utils')

export function testComponent (Component, props) {
  let observerAdded = 0
  let observerDestroyed = 0
  let becomeVisible = null
  let src = '/image.png'
  function $img () {
    return src
  }
  $img.$observer = {
    add (_, callback) {
      observerAdded += 1
      becomeVisible = callback
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
    expect(observerAdded).toBe(props.legacy ? 0 : 1)
    expect(observerDestroyed).toBe(0)
  })
  test('Generate alt', () => {
    expect(wrapper.vm.imgAttributes.alt).toEqual('image')
    const domAlt = wrapper.find('.__nim_o').element.getAttribute('alt')
    expect(domAlt).toEqual('image')
  })
  test('Set src', (done) => {
    if (props.legacy) {
      const domSrcBefore = wrapper.find('.__nim_o').element.getAttribute('src')
      expect(domSrcBefore).toEqual(src)
      return done()
    }
    const domSrcBefore = wrapper.find('.__nim_o').element.getAttribute('src')
    expect(domSrcBefore).toBeNull()
    becomeVisible()
    process.nextTick(() => {
      const domSrcAfter = wrapper.find('.__nim_o').element.getAttribute('src')
      expect(domSrcAfter).toEqual(src)
      done()
    })
  })
  test('Change src', (done) => {
    src = '/image.jpeg'
    wrapper.setProps({ src })
    process.nextTick(() => {
      if (props.legacy) {
        expect(observerAdded).toBe(props.legacy ? 0 : 2)
        expect(observerDestroyed).toBe(props.legacy ? 0 : 1)

        const domSrcBefore = wrapper.find('.__nim_o').element.getAttribute('src')
        expect(domSrcBefore).toEqual(src)
        return done()
      }

      const domSrcAfter = wrapper.find('.__nim_o').element.getAttribute('src')
      expect(domSrcAfter).toEqual(src)
      done()
    })
  })

  test('sets', () => {
    if (Component.name === 'NuxtImage') {
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
    expect(observerDestroyed).toBe(props.legacy ? 0 : 2)
  })
}

function testImageSets (wrapper) {
  const possibleSizes = [
    '(min-width: 900px) 900px, (min-width: 500px) 500px, 200px',
    '200px'
  ]
  const sizes = wrapper.find('.__nim_o').element.getAttribute('sizes')
  expect(possibleSizes).toContain(sizes)
}

function testPictureSets (wrapper) {
  expect(wrapper.find('[media="(min-width: 900px)"]').exists()).toBe(true)
  expect(wrapper.find('[media="(min-width: 500px)"]').exists()).toBe(true)
  expect(wrapper.find('[type="webp"]').exists()).toBe(true)
}
