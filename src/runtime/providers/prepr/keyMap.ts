/**
 * Key map is responsible for mapping readable "properties", which can be passed
 * as modifiers of `NuxtImg` component, to URL path parameters that can be
 * interpreted Prepr's REST API.
 */
const keyMap = {
  crop: 'c',
  format: 'format',
  height: 'h',
  quality: 'q',
  width: 'w'
} as const

type KeyMapKey = keyof typeof keyMap
type KeyMapValue= typeof keyMap[KeyMapKey]

export { keyMap }
export type { KeyMapKey, KeyMapValue }
