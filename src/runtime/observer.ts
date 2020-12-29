export function createObserver (intersectionOptions: object) {
  const callbackType = { intersect: 'onIntersect', print: 'onPrint' }
  const elementCallbackMap = {}
  function intersectionCallback (entries, imgObserver) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target
        const callback = elementCallbackMap[lazyImage.__unique]
        if (typeof callback === 'function') {
          callback(callbackType.intersect)
        }
        delete elementCallbackMap[lazyImage.__unique]
        imgObserver.unobserve(lazyImage)
      }
    })
  }

  printObserver(() => {
    Object.values(elementCallbackMap).forEach((callback: any) => callback(callbackType.print))
  })

  const intersectObserver = intersectionObserver(intersectionCallback, intersectionOptions)

  return {
    add (target, component, unique) {
      // add unique id to recognize target
      target.__unique = unique || target.id || target.__vue__._uid
      elementCallbackMap[target.__unique] = component
      intersectObserver.observe(target)
    },
    remove (target) {
      delete elementCallbackMap[target.__unique]
      intersectObserver.unobserve(target)
    }
  }
}

function intersectionObserver (onMatch, options): IntersectionObserver | undefined {
  if (typeof IntersectionObserver === 'undefined') {
    return
  }
  return new IntersectionObserver(onMatch, {
    rootMargin: '50px',
    ...options
  })
}

function printObserver (onMatch) {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return
  }

  const mediaQueryList = window.matchMedia('print')
  mediaQueryList.addListener((query) => {
    if (query.matches) {
      onMatch()
    }
  })
}
