/**
 * Feature detection enables us to analyze the performance of nuxt/image
 * usages and validate performance outcomes (in aggregate only).
 *
 * Javascript-based feature markers have been standardized in the W3C group
 *  around the User Timing API. See more detail here:
 * https://www.w3.org/TR/user-timing/#dfn-mark_feature_usage
 */
export function markFeatureUsage(featureName: string) {
  performance?.mark?.('mark_feature_usage', {
    detail: {
      feature: featureName,
    },
  })
}
