import { expect, test } from '@jest/globals'
import * as CompletionType from '../src/parts/CompletionType/CompletionType.ts'
import { getCompletionSelectionRange } from '../src/parts/GetCompletionSelectionRange/GetCompletionSelectionRange.ts'

test.each([
  ['boolean true', 'editor.cache', '"editor.cache": true', 16, 20],
  ['boolean false', 'enabled', '"enabled": false', 11, 16],
  ['boolean true before another property', 'editor.cache', '"editor.cache": true,', 16, 20],
  ['boolean false before another property', 'enabled', '"enabled": false,', 11, 16],
  ['enum', 'mode', '"mode": "first"', 9, 14],
  ['number', 'count', '"count": 42', 9, 11],
  ['string', 'name', '"name": "value"', 9, 14],
  ['colon in property name', 'prefix: name', '"prefix: name": true', 16, 20],
  ['colon in string default', 'name', '"name": "prefix: value"', 9, 22],
])(
  'selects the resolved %s default',
  (_name, label, snippet, startOffset, endOffset) => {
    expect(
      getCompletionSelectionRange(CompletionType.Property, label, snippet),
    ).toEqual({ endOffset, startOffset })
  },
)

test('does not select a missing property value', () => {
  expect(
    getCompletionSelectionRange(CompletionType.Property, 'name', '"name": '),
  ).toBeUndefined()
})

test('does not select a snippet for a different property', () => {
  expect(
    getCompletionSelectionRange(
      CompletionType.Property,
      'name',
      '"other": true',
    ),
  ).toBeUndefined()
})

test.each(['true', 'false'])('selects the boolean value %s', (value) => {
  expect(
    getCompletionSelectionRange(CompletionType.Value, value, value),
  ).toEqual({ endOffset: value.length, startOffset: 0 })
})

test.each(['true', 'false'])(
  'selects the boolean value %s without its trailing comma',
  (value) => {
    expect(
      getCompletionSelectionRange(CompletionType.Value, value, `${value},`),
    ).toEqual({ endOffset: value.length, startOffset: 0 })
  },
)

test('selects the contents of a string value completion', () => {
  expect(
    getCompletionSelectionRange(CompletionType.Value, 'commonjs', '"commonjs"'),
  ).toEqual({ endOffset: 9, startOffset: 1 })
})

test('does not select a numeric value completion', () => {
  expect(
    getCompletionSelectionRange(CompletionType.Value, 'count', '42'),
  ).toBeUndefined()
})
