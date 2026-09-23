import { expect, test } from '@jest/globals'
import * as ShouldAppendPropertyComma from '../src/parts/ShouldAppendPropertyComma/ShouldAppendPropertyComma.ts'

const shouldAppend = (text: string, offset: number): boolean =>
  ShouldAppendPropertyComma.shouldAppendPropertyComma(text, offset)

const completionEnd = (text: string): number =>
  text.indexOf('commonjs') + 'commonjs'.length + 1

test('adds a comma before an adjacent property', () => {
  const text = '{"type": "commonjs"\n"workspaces": []}'
  expect(shouldAppend(text, completionEnd(text))).toBe(true)
})

test('does not add a comma before the closing object', () => {
  const text = '{"type": "commonjs"\n}'
  expect(shouldAppend(text, completionEnd(text))).toBe(false)
})

test('does not duplicate an existing comma with whitespace', () => {
  const text = '{"type": "commonjs"  ,\n"workspaces": []}'
  expect(shouldAppend(text, completionEnd(text))).toBe(false)
})

test('adds a comma before a following property after a comment', () => {
  const text = '{"type": "commonjs" /* comment */\n"workspaces": []}'
  expect(shouldAppend(text, completionEnd(text))).toBe(true)
})

test('does not duplicate a comma after a comment', () => {
  const text = '{"type": "commonjs" /* comment */ ,\n"workspaces": []}'
  expect(shouldAppend(text, completionEnd(text))).toBe(false)
})
