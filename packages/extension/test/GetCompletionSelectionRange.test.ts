import { expect, test } from '@jest/globals'
import * as CompletionType from '../src/parts/CompletionType/CompletionType.ts'
import { getCompletionSelectionRange } from '../src/parts/GetCompletionSelectionRange/GetCompletionSelectionRange.ts'

test.each([
  ['boolean true', 'editor.cache', '"editor.cache": true', 16, 20],
  ['boolean false', 'enabled', '"enabled": false', 11, 16],
  ['enum', 'mode', '"mode": "first"', 8, 15],
  ['number', 'count', '"count": 42', 9, 11],
  ['string', 'name', '"name": "value"', 8, 15],
  ['colon in property name', 'prefix: name', '"prefix: name": true', 16, 20],
  ['colon in string default', 'name', '"name": "prefix: value"', 8, 23],
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

test('does not select a value completion', () => {
  expect(
    getCompletionSelectionRange(CompletionType.Value, 'enabled', 'true'),
  ).toBeUndefined()
})
