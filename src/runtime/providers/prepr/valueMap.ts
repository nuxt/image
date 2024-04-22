/**
 * Value map is responsible for mapping readable "properties" defined in
 * `keyMap.ts` aswell as native modifiers of `NuxtImg` component, to URL path
 * parameter values that can be interpreted Prepr's REST API.
 *
 * ```Examples
 * Prepr's `w` path param expects an arbitrary number, so, it does not need to be in `valueMap`
 *
 * Our custom param `width` maps to `w` in keyMap, so, it does not need to be in `valueMap`
 *
 * Prepr's `format` path param expects a string which can either be `jpg` or `png`,
 * if we want to allow the user to pass <NuxtImage :modifiers="{ format: 'jpeg' }" />,
 * because it is a valid option of <NuxtImg :format />, then we need to have
 * `jpeg` to `jpg` because Prepr's API does not recognize `jpeg`. Similar things
 * could be said for `fit=cover`, which should map to `fit=crop`
 *```
 */
const valueMap = {
  format: {
    jpeg: 'jpg',
  },
  fit: {
    cover: 'crop', // Prepr.io accepts value `crop` defaulting to value `centre`
  },
} as const

type ValuesMapKey = keyof typeof valueMap
type ValuesMapValue = typeof valueMap[ValuesMapKey]

export { valueMap }
export type { ValuesMapKey, ValuesMapValue }
