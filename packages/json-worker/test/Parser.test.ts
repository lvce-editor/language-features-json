import * as Jsonc from '../src/parts/Jsonc/Jsonc.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'
import { test, expect } from '@jest/globals'

test('boolean - true', () => {
  const text = 'true'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.Boolean,
      offset: 0,
      length: 4,
      childCount: 0,
      value: true,
    },
  ])
})

test('empty object with whitespace', () => {
  const text = '{ }'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.Object,
      offset: 0,
      length: 3,
      childCount: 0,
    },
  ])
})
