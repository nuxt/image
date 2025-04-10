import { encodeParam } from 'ufo'
import { describe, expect, it } from 'vitest'
import { createOperationsGenerator } from '~/src/runtime'

describe('operations generator', () => {
  const operationsGenerator = createOperationsGenerator({
    keyMap: {
      format: 'f',
      fit: 'fit',
      width: 'w',
      height: 'h',
      resize: 's',
      quality: 'q',
      background: 'b',
    },
    valueMap: {
      format: {
        webp: 'super-webp',
      },
      func(key: string) {
        return `woohoo-${key}`
      },
    },
    formatter: (key, val) => encodeParam(key) + '_' + encodeParam(val),
  })

  it('keyMap', () => {
    expect(operationsGenerator({ format: 'jpg' })).toMatchInlineSnapshot(`"f_jpg"`)
  })

  it('valueMap', () => {
    expect(operationsGenerator({ func: 'webp' })).toMatchInlineSnapshot(`"func_woohoo-webp"`)
  })

  it('custom formatter', () => {
    expect(operationsGenerator({ test: '23' })).toMatchInlineSnapshot(`"test_23"`)
  })

  it('joinWith', () => {
    expect(operationsGenerator({ test: '23', other: 'thing' })).toMatchInlineSnapshot(`"test_23&other_thing"`)
  })
})
