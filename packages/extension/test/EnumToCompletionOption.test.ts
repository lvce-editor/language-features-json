import { expect, test } from '@jest/globals'
import * as CompletionType from '../src/parts/CompletionType/CompletionType.ts'
import * as EnumToCompletionOption from '../src/parts/EnumToCompletionOption/EnumToCompletionOption.ts'

test('quotes string values', () => {
  expect(EnumToCompletionOption.enumToCompletionOption('newTab')).toEqual({
    kind: CompletionType.Value,
    label: 'newTab',
    snippet: '"newTab"',
  })
})

test('does not quote boolean values', () => {
  expect(EnumToCompletionOption.enumToCompletionOption(true)).toEqual({
    kind: CompletionType.Value,
    label: 'true',
    snippet: 'true',
  })
})
