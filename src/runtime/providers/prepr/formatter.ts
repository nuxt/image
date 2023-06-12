export function formatter (key: string, value: string) {
  return String(value) === 'true' ? key : `${key}_${value}`
}
