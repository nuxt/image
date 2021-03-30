require('jsdom-global')()
const { mount } = require('@vue/test-utils')

export function testComponent (Component, props) {
  let src = '/image.pdf'
  function $img () {
    return src
  }
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
    const domSrc = wrapper.element.getAttribute('href')
    expect(domSrc).toEqual(src)
  })
  test('Change src', (done) => {
    src = '/image.jpeg'
    wrapper.setProps({ src })
    process.nextTick(() => {
      const domSrcBefore = wrapper.find('.nuxt-download-link').element.getAttribute('href')
      expect(domSrcBefore).toEqual(src)
      done()
    })
  })
}
