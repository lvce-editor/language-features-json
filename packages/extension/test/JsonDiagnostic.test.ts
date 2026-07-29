import { expect, test } from '@jest/globals'
import * as JsonDiagnostic from '../src/parts/JsonDiagnostic/JsonDiagnostic.ts'

const schema = {
  type: 'object',
  properties: {
    prettier: {
      type: 'object',
      properties: {
        semi: { type: 'boolean' },
        printWidth: { type: 'integer' },
        trailingComma: { type: 'string', enum: ['all', 'es5', 'none'] },
      },
    },
  },
} as const

test('reports a nested boolean type mismatch', () => {
  const text = '{\n  "prettier": {\n    "semi": "yes"\n  }\n}'
  expect(
    JsonDiagnostic.getDiagnostics(
      text,
      'file:///workspace/package.json',
      schema,
    ),
  ).toEqual([
    {
      code: 'type',
      columnIndex: 12,
      endColumnIndex: 17,
      endRowIndex: 2,
      message: 'Incorrect type. Expected "boolean" but received "string".',
      rowIndex: 2,
      source: 'json',
      type: 'error',
      uri: 'file:///workspace/package.json',
    },
  ])
})

test('reports an integer type mismatch', () => {
  const text = '{ "prettier": { "printWidth": 80.5 } }'
  expect(
    JsonDiagnostic.getDiagnostics(
      text,
      'file:///workspace/package.json',
      schema,
    )[0],
  ).toMatchObject({
    code: 'type',
    message: 'Incorrect type. Expected "integer" but received "number".',
  })
})

test('reports an invalid enum value', () => {
  const text = '{ "prettier": { "trailingComma": "sometimes" } }'
  expect(
    JsonDiagnostic.getDiagnostics(
      text,
      'file:///workspace/package.json',
      schema,
    )[0],
  ).toMatchObject({
    code: 'enum',
    message: 'Value is not accepted. Valid values: "all", "es5", "none".',
  })
})

test('accepts valid prettier values', () => {
  const text =
    '{ "prettier": { "semi": false, "printWidth": 100, "trailingComma": "all" } }'
  expect(
    JsonDiagnostic.getDiagnostics(
      text,
      'file:///workspace/package.json',
      schema,
    ),
  ).toEqual([])
})
