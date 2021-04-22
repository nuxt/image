export function mockObserver () {
  const observer = {
    targets: [] as Element[],
    wasAdded: false,
    wasDestroyed: false,
    callbacks: [] as Array<(entries: IntersectionObserverEntry[]) => any>,
    triggerVisibility () {
      this.callbacks.forEach(cb => cb(this.targets.map(target => ({ target, isIntersecting: true, intersectionRatio: 1 } as any))))
    }
  }
  window.IntersectionObserver = class IntersectionObserver {
    constructor (callback: () => any) {
      observer.callbacks.push(callback)
    }

    observe (target: Element) {
      observer.targets.push(target)
      observer.wasAdded = true
    }

    disconnect () {
      observer.wasDestroyed = true
    }

    unobserve () {
      observer.wasDestroyed = true
    }
  } as any

  return observer
}
