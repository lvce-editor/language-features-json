import { expect, test } from '@jest/globals'
import * as JsonSyntaxDiagnostics from '../src/parts/JsonSyntaxDiagnostics/JsonSyntaxDiagnostics.ts'

const getMessage = (text: string): string | undefined =>
  JsonSyntaxDiagnostics.getDiagnostics(text)[0]?.message

test('reports a missing comma between object properties', () => {
  expect(getMessage('{"name":"app" "version":"1"}')).toBe(
    'Expected a comma between JSON values.',
  )
})

test('reports a missing comma between array items', () => {
  expect(getMessage('[1 2]')).toBe('Expected a comma between JSON values.')
})

test('reports a missing property colon', () => {
  expect(getMessage('{"name" "app"}')).toBe(
    'Expected a colon after the property name.',
  )
})

test('reports a missing property value', () => {
  expect(getMessage('{"name":}')).toBe('Invalid JSON syntax.')
})

test('reports an invalid literal', () => {
  expect(getMessage('{"enabled": tru}')).toBe('Invalid JSON syntax.')
})

test('reports an unterminated string', () => {
  expect(getMessage('{"name":"app}')).toBe('Unterminated JSON string.')
})

test('reports an unmatched delimiter', () => {
  expect(getMessage('{"name":"app"')).toBe(
    'Expected a closing brace or bracket.',
  )
})

test('reports trailing non-whitespace content', () => {
  expect(getMessage('{"name":"app"} true')).toBe('Invalid JSON syntax.')
})

test('accepts valid JSON', () => {
  expect(JsonSyntaxDiagnostics.getDiagnostics('{"name":"app"}')).toEqual([])
})

test('accepts the comments and trailing commas used by JSONC documents', () => {
  expect(
    JsonSyntaxDiagnostics.getDiagnostics(
      '{\n // comment\n "name": "app",\n}',
    ),
  ).toEqual([])
})

test('preserves useful multiline diagnostic positions', () => {
  const text = '{\n  "name": "app"\n  "version": "1"\n}'
  expect(JsonSyntaxDiagnostics.getDiagnostics(text)[0]).toMatchObject({
    code: 'syntax',
    rowIndex: 2,
    columnIndex: 2,
    endRowIndex: 2,
    endColumnIndex: 3,
    source: 'json (syntax)',
    type: 'error',
  })
})
