
interface Observer {
  add: (el, cb) => void
  remove: (el) => void
  supported: boolean
}

let observerInstance: Observer
let observerIdCtr = 1
const OBSERVER_ID_KEY = '__observer_id__'

export function getObserver (): Observer | false {
  if (typeof IntersectionObserver === 'undefined') {
    return false
  }

  if (observerInstance) {
    return observerInstance
  }

  const elementCallbackMap = {}

  const remove = (el) => {
    if (!el[OBSERVER_ID_KEY]) { return }
    delete elementCallbackMap[el[OBSERVER_ID_KEY]]
    delete el[OBSERVER_ID_KEY]
    intersectObserver.unobserve(el)
  }

  const add = (el, fn) => {
    el[OBSERVER_ID_KEY] = el[OBSERVER_ID_KEY] || ++observerIdCtr
    elementCallbackMap[el[OBSERVER_ID_KEY]] = fn
    intersectObserver.observe(el)
  }

  onPrint(() => {
    Object.values(elementCallbackMap).forEach((fn: any) => fn('print'))
  })

  const onMatch = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const fn = elementCallbackMap[entry.target[OBSERVER_ID_KEY]]
        if (typeof fn === 'function') { fn('intersect') }
        remove(entry.target)
      }
    }
  }
  const intersectObserver = new IntersectionObserver(onMatch, { rootMargin: '50px' })

  observerInstance = { supported: true, add, remove }
  return observerInstance
}

export function useObserver (el, fn): Function {
  const observer = getObserver()
  if (!observer) {
    fn('unsupported')
    return () => {}
  }
  observer.add(el, fn)
  return () => observer.remove(el)
}

function onPrint (fn) {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return
  }
  const mediaQueryList = window.matchMedia('print')

  const handleQuery = (query) => {
    if (query.matches) {
      fn()
    }
  }

  if (typeof mediaQueryList.addEventListener === 'function') {
    mediaQueryList.addEventListener('change', handleQuery)
  } else {
    // Safari/Older Browser Fallback
    mediaQueryList.addListener(handleQuery)
  }
}
