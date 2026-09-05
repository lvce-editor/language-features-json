import { expect, test } from '@jest/globals'
import * as JsonDiagnostics from '../src/parts/JsonDiagnostics/JsonDiagnostics.ts'

const schema = {
  additionalProperties: false,
  properties: {
    $schema: { type: 'string' },
    focused: { type: 'boolean' },
    focusedIndex: { type: 'integer' },
    nested: { properties: { label: { type: 'string' } }, type: 'object' },
  },
  type: 'object',
} as const

test('reports a property type mismatch', () => {
  expect(
    JsonDiagnostics.getDiagnostics('{ "focusedIndex": "first" }', schema),
  ).toEqual([
    expect.objectContaining({
      code: 'type',
      message: 'Incorrect type. Expected "integer" but received "string".',
      source: 'json (schema_validation)',
      type: 'error',
    }),
  ])
})

test('validates nested properties', () => {
  expect(
    JsonDiagnostics.getDiagnostics('{ "nested": { "label": false } }', schema),
  ).toEqual([
    expect.objectContaining({
      code: 'type',
      message: 'Incorrect type. Expected "string" but received "boolean".',
    }),
  ])
})

test('reports unknown properties when the schema disallows them', () => {
  expect(JsonDiagnostics.getDiagnostics('{ "unknown": true }', schema)).toEqual(
    [
      expect.objectContaining({
        code: 'additionalProperties',
        message: 'Property "unknown" is not allowed.',
      }),
    ],
  )
})

test('accepts valid component state', () => {
  expect(
    JsonDiagnostics.getDiagnostics(
      '{ "$schema": "live-component-state:///schemas/7.json", "focused": true, "focusedIndex": 1, "nested": { "label": "first" } }',
      schema,
    ),
  ).toEqual([])
})

test('accepts a negative index before an integer header height', () => {
  expect(
    JsonDiagnostics.getDiagnostics(
      '{ "focusedIndex": -1, "headerHeight": 61 }',
      {
        properties: {
          focusedIndex: { type: 'integer' },
          headerHeight: { type: 'integer' },
        },
        type: 'object',
      },
    ),
  ).toEqual([])
})

test('still validates properties following a negative number', () => {
  expect(
    JsonDiagnostics.getDiagnostics(
      '{ "focusedIndex": -1, "focused": "yes" }',
      schema,
    ),
  ).toEqual([
    expect.objectContaining({
      message: 'Incorrect type. Expected "boolean" but received "string".',
    }),
  ])
})
