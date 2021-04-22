/* eslint-disable no-use-before-define */
type ObserverCallback = (event?: 'unsupported' | 'intersect') => any

interface Observer {
  add: (el: ObservedElement, cb: ObserverCallback) => void
  remove: (el: ObservedElement) => void
  supported: boolean
}

let observerInstance: Observer
let observerIdCtr = 1
const OBSERVER_ID_KEY = '__observer_id__'

type ObservedElement = Element & { [OBSERVER_ID_KEY]?: number | string }

export function getObserver (): Observer | false {
  if (typeof IntersectionObserver === 'undefined') {
    return false
  }

  if (observerInstance) {
    return observerInstance
  }

  const elementCallbackMap: Record<string | number, ObserverCallback> = {}

  const remove = (el: ObservedElement) => {
    const key = el[OBSERVER_ID_KEY]
    if (!key) { return }
    delete elementCallbackMap[key]
    delete el[OBSERVER_ID_KEY]
    intersectObserver.unobserve(el)
  }

  const add = (el: ObservedElement, fn: () => any) => {
    el[OBSERVER_ID_KEY] = el[OBSERVER_ID_KEY] || ++observerIdCtr
    elementCallbackMap[el[OBSERVER_ID_KEY]!] = fn
    intersectObserver.observe(el)
  }

  onPrint(() => {
    Object.values(elementCallbackMap).forEach((fn: any) => fn('print'))
  })

  const onMatch = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const fn = elementCallbackMap[(entry.target as ObservedElement)[OBSERVER_ID_KEY]!]
        if (typeof fn === 'function') { fn('intersect') }
        remove(entry.target)
      }
    }
  }
  const intersectObserver = new IntersectionObserver(onMatch, { rootMargin: '50px' })

  observerInstance = { supported: true, add, remove }
  return observerInstance
}

export function useObserver (el: ObservedElement, fn: ObserverCallback): Function {
  const observer = getObserver()
  if (!observer) {
    fn('unsupported')
    return () => {}
  }
  observer.add(el, fn)
  return () => observer.remove(el)
}

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
