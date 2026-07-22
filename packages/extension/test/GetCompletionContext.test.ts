import { expect, test } from '@jest/globals'
import * as GetCompletionContext from '../src/parts/GetCompletionContext/GetCompletionContext.ts'

test('gets root property completion context', () => {
  const text = '{ "nam" }'
  expect(GetCompletionContext.getCompletionContext(text, 6)).toEqual({
    kind: 'property',
    path: [],
  })
})

test('gets nested property completion context', () => {
  const text = '{ "prettier": { "sem" } }'
  expect(GetCompletionContext.getCompletionContext(text, 21)).toEqual({
    kind: 'property',
    path: ['prettier'],
  })
})

test('gets a string value completion context', () => {
  const text = '{ "type": "mod" }'
  expect(GetCompletionContext.getCompletionContext(text, 15)).toEqual({
    kind: 'value',
    path: ['type'],
  })
})

test('gets a missing nested value completion context', () => {
  const text = '{ "prettier": { "trailingComma":  } }'
  expect(GetCompletionContext.getCompletionContext(text, 34)).toEqual({
    kind: 'value',
    path: ['prettier', 'trailingComma'],
  })
})
