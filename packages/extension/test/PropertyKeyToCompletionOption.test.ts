import { expect, test } from '@jest/globals'
import * as CompletionType from '../src/parts/CompletionType/CompletionType.ts'
import * as PropertyKeyToCompletionOption from '../src/parts/PropertyKeyToCompletionOption/PropertyKeyToCompletionOption.ts'

test('includes a boolean default value', () => {
  expect(
    PropertyKeyToCompletionOption.propertyKeyToCompletionOption(
      'editor.cache',
      { default: true, type: 'boolean' },
    ),
  ).toEqual({
    kind: CompletionType.Property,
    label: 'editor.cache',
    snippet: '"editor.cache": true',
  })
})

test('uses true for a boolean without a default', () => {
  expect(
    PropertyKeyToCompletionOption.propertyKeyToCompletionOption('enabled', {
      type: 'boolean',
    }),
  ).toEqual({
    kind: CompletionType.Property,
    label: 'enabled',
    snippet: '"enabled": true',
  })
})

test('uses the first enum value when there is no default', () => {
  expect(
    PropertyKeyToCompletionOption.propertyKeyToCompletionOption('mode', {
      enum: ['first', 'second'],
      type: 'string',
    }),
  ).toEqual({
    kind: CompletionType.Property,
    label: 'mode',
    snippet: '"mode": "first"',
  })
})

test('adds a colon and space when there is no suggested value', () => {
  expect(
    PropertyKeyToCompletionOption.propertyKeyToCompletionOption('name', {
      type: 'string',
    }),
  ).toEqual({
    kind: CompletionType.Property,
    label: 'name',
    snippet: '"name": ',
  })
})
