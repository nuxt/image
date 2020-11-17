import { AllowList } from 'types'

const REGEX_RULES = [
  { matcher: /[\\$.|*+(){^]/g, replacer: match => `\\${match}` }
]

const regexCache = {}
function makeRegex (pattern: string | RegExp, ignorecase: boolean): RegExp {
  if (pattern instanceof RegExp) {
    return pattern
  }

  if (!regexCache[pattern]) {
    const source = REGEX_RULES.reduce(
      (prev, { matcher, replacer }) => prev.replace(matcher, replacer),
      pattern
    )

    regexCache[pattern] = ignorecase
      ? new RegExp(source, 'i')
      : new RegExp(source)
  }
  return regexCache[pattern]
}

function allowFunction (options: any, ignorecase: boolean) {
  if (typeof options === 'function') {
    return options
  }

  if (typeof options === 'string') {
    return allowFunction([options], ignorecase)
  }

  if (Array.isArray(options)) {
    const patterns = options.map(option => makeRegex(option, ignorecase))
    return (value) => {
      return !!patterns.some(pattern => pattern.test(value))
    }
  }
  throw new Error('Unsupported options')
}

export function allowList (options, ignorecase: boolean = false): AllowList {
  const allow = {
    accept: (_value: string) => true,
    reject: (_value: string) => false,
    allow: (value: string) => allow.accept(value) && !allow.reject(value)
  }

  if (options && (options.accept || options.reject)) {
    allow.accept = options.accept ? allowFunction(options.accept, ignorecase) : allow.accept
    allow.reject = options.reject ? allowFunction(options.reject, ignorecase) : allow.reject
  } else {
    allow.accept = allowFunction(options, ignorecase)
  }

  return allow
}
