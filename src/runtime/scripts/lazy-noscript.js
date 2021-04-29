const EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

const supportsLazyLoading = 'loading' in HTMLImageElement.prototype

if (!supportsLazyLoading) {
  const script = document.createElement('script')
  script.src = 'lazy-polyfill.js'
  script.async = true
  document.head.appendChild(script)
}

const noscripts = document.querySelectorAll('noscript')

noscripts.forEach(function (el) {
  let html = el.innerHTML.trim().replace(/&lt;/g, '<').replace(/&gt;/g, '>')

  if (!html.match(/loading="lazy"/)) {
    return
  }

  if (!supportsLazyLoading) {
    html = html.replace(/ src="([^"]*)"/g, (_, src) => ` src="${EMPTY_GIF}" data-src="${src}"`)
  }

  const wrapper = document.createElement('div')
  wrapper.innerHTML = html

  if (wrapper.firstChild) {
    el.replaceWith(wrapper.firstChild)
  }
})
