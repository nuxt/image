/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
type ObserverCallback = (event?: 'intersect' | 'unsupported') => any

interface Observer {
  add: (el: ObservedElement, cb: ObserverCallback) => void
  remove: (el: ObservedElement) => void
}

let observerInstance: Observer
const OBSERVED_KEY = '__observed__'

const elementCallbackMap = new WeakMap<ObservedElement, ObserverCallback>()

type ObservedElement = Element & { [OBSERVED_KEY]?: boolean }

function onPrint (fn: ObserverCallback) {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return
  }
  const mediaQueryList = window.matchMedia('print')
  mediaQueryList.addEventListener('change', (query) => {
    if (query.matches) {
      fn()
    }
  })
}

function getObserver (): Observer | false {
  if (typeof IntersectionObserver === 'undefined') {
    return false
  }

  if (observerInstance) {
    return observerInstance
  }

  const remove = (el: ObservedElement) => {
    if (!el[OBSERVED_KEY]) {
      return
    }
    elementCallbackMap.delete(el)
    delete el[OBSERVED_KEY]
    intersectObserver.unobserve(el)
  }

  const add = (el: ObservedElement, fn: () => any) => {
    el[OBSERVED_KEY] = true
    elementCallbackMap.set(el, fn)
    intersectObserver.observe(el)
  }

  onPrint(() =>
    Object.values(elementCallbackMap).forEach((fn: any) => fn('print'))
  )

  const onMatch = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const fn = elementCallbackMap.get(entry.target)
        if (typeof fn === 'function') {
          fn('intersect')
        }
        remove(entry.target)
      }
    }
  }
  const intersectObserver = new IntersectionObserver(onMatch, { rootMargin: '50px' })

  observerInstance = { add, remove }
  return observerInstance
}

function useObserver (el: ObservedElement, fn: ObserverCallback) {
  const observer = getObserver()
  if (!observer) {
    return fn('unsupported')
  }
  observer.add(el, fn)
}

const root = document.querySelector('#__nuxt') || document

function observeLazyImages (nodes: NodeList | Array<Element | Document> = [root]) {
  nodes.forEach((node) => {
    if (!('querySelectorAll' in node)) {
      return
    }
    const lazyImages = node.querySelectorAll('img[loading="lazy"]') as NodeListOf<HTMLImageElement>
    lazyImages.forEach((el) => {
      if (el.dataset.intersected || (el as ObservedElement)[OBSERVED_KEY]) {
        return
      }
      useObserver(el, () => {
        el.dataset.intersected = 'intersected'
        if (el.dataset.src) {
          el.src = el.dataset.src
        }
      })
    })
  })
}

const mutationObserver = new MutationObserver((entries) => {
  entries.forEach(record => observeLazyImages(record.addedNodes))
})

mutationObserver.observe(root, {
  attributes: false,
  childList: true,
  subtree: true
})

observeLazyImages()
