// @ts-ignore
import { defineNuxtPlugin } from '#imports'
type PerfEntry = PerformanceEntry & { element: any };
type ElementNode = ChildNode & { attributes: { href: { value: string } } };

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const performanceEntry = entry as PerfEntry
        // eslint-disable-next-line no-console
        console.info('[@nuxt/image] Potential LCP Element: ', performanceEntry)

        // If element is not an image, stop execution
        if (performanceEntry.element.tagName !== 'IMG') { return }

        if (performanceEntry.element.attributes?.loading?.value === 'lazy') {
          // eslint-disable-next-line no-console
          console.warn(
            '[@nuxt/image] LCP Element should not have `loading="lazy"` \n\n Learn more: https://web.dev/optimize-lcp/#optimize-the-priority-the-resource-is-given'
          )
        }
        if (hasImageFormat(performanceEntry.element.src)) {
          if (
            !performanceEntry.element.src.includes('webp') ||
            !performanceEntry.element.src.includes('avif')
          ) {
            // eslint-disable-next-line no-console
            console.warn(
              '[@nuxt/image] LCP Element can be served in a next gen format like `webp` or `avif` \n\n Learn more: https://web.dev/choose-the-right-image-format/'
            )
          }
        }
        if (performanceEntry.element.fetchPriority !== 'high') {
          // eslint-disable-next-line no-console
          console.warn(
            '[@nuxt/image] LCP Element can have `fetchPriority="high"` to load as soon as possible \n\n Learn more: https://web.dev/optimize-lcp/#optimize-the-priority-the-resource-is-given'
          )
        }
        if (
          !performanceEntry.element.attributes.width ||
          !performanceEntry.element.attributes.height
        ) {
          // eslint-disable-next-line no-console
          console.warn(
            '[@nuxt/image] Images should have `width` and `height` sizes set  \n\n Learn more: https://web.dev/optimize-cls/#images-without-dimensions'
          )
        }
        if (performanceEntry.startTime > 2500) {
          // eslint-disable-next-line no-console
          console.warn(
            `[@nuxt/image] LCP Element loaded in ${performanceEntry.startTime} miliseconds. Good result is below 2500 miliseconds \n\n Learn more: https://web.dev/lcp/#what-is-a-good-lcp-score`
          )
        }

        if (
          !Array.from(document.head.childNodes).filter(
            el =>
              el.nodeName === 'LINK' &&
              (el as ElementNode).attributes.href.value ===
                performanceEntry.element.src
          ).length
        ) {
          // eslint-disable-next-line no-console
          console.warn(

            '[@nuxt/image] LCP Element can be preloaded in `head` to improve load time \n\n Learn more: https://web.dev/optimize-lcp/#optimize-when-the-resource-is-discovered'
          )
        }
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true })
  })
})

const hasImageFormat = (src: string) => {
  const imageFormats = ['avif', 'jpg', 'jpeg', 'png', 'webp']

  return imageFormats.some(format => src.includes(format))
}
