require('jsdom-global')()
const { mount } = require('@vue/test-utils')

export function testComponent (Component, props) {
  let src = '/image.png'
  function $img () {
    return src
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
  test('Set src', () => {
    const domSrc = wrapper.element.getAttribute('src')
    expect(domSrc).toEqual(src)
  })
  test('Generate alt', () => {
    expect(wrapper.vm.generatedAlt).toEqual('image')
    const domAlt = wrapper.element.getAttribute('alt')
    expect(domAlt).toEqual('image')
  })

  test('Change src', (done) => {
    src = '/image.jpeg'
    wrapper.setProps({ src })
    process.nextTick(() => {
      if (props.lazy === false) {
        const domSrcBefore = wrapper.find('.nuxt-img').element.getAttribute('src')
        expect(domSrcBefore).toEqual(src)
        return done()
      }

      const domSrcAfter = wrapper.find('.nuxt-img').element.getAttribute('src')
      expect(domSrcAfter).toEqual(src)
      done()
    })
  })

  test('sizes', () => {
    const possibleSizes = [
      '200px, (min-width: 500px) 500px, (min-width: 900px) 900px',
      '200px'
    ]
    const sizes = wrapper.find('.nuxt-img').element.getAttribute('sizes')
    expect(possibleSizes).toContain(sizes)
  })

  test('noscript', () => {
    const noscript = wrapper.find('noscript')
    expect(noscript.exists()).toBe(!!props.noScript)
  })
}
