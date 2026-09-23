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

test('validates the full value of a number with an exponent', () => {
  expect(
    JsonDiagnostics.getDiagnostics('{"focusedIndex": 1e-7}', schema),
  ).toEqual([
    expect.objectContaining({
      message: 'Incorrect type. Expected "integer" but received "number".',
    }),
  ])
  expect(
    JsonDiagnostics.getDiagnostics('{"focusedIndex": -1e+2}', schema),
  ).toEqual([])
})

test('validates arbitrary string dictionary entries', () => {
  const cacheSchema = {
    type: 'object',
    additionalProperties: { type: 'string' },
  }
  const cache = Object.fromEntries(
    Array.from({ length: 1000 }, (_, index) => [
      `live-component-state:///${index}.json`,
      '/file-icons/json.svg',
    ]),
  )
  expect(
    JsonDiagnostics.getDiagnostics(JSON.stringify(cache), cacheSchema),
  ).toEqual([])
  expect(
    JsonDiagnostics.getDiagnostics(
      JSON.stringify({ ...cache, 'file:///invalid.json': 1 }),
      cacheSchema,
    ),
  ).toEqual([
    expect.objectContaining({
      message: 'Incorrect type. Expected "string" but received "number".',
    }),
  ])
})

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

test('validates inclusive numeric minimum and maximum bounds', () => {
  const boundedSchema = {
    properties: {
      value: { maximum: 100, minimum: 10, type: 'number' },
    },
    type: 'object',
  }

  expect(
    JsonDiagnostics.getDiagnostics('{"value": -15}', boundedSchema),
  ).toEqual([
    expect.objectContaining({
      code: 'minimum',
      message: 'Value must be greater than or equal to 10.',
    }),
  ])
  expect(
    JsonDiagnostics.getDiagnostics('{"value": 9}', boundedSchema),
  ).toHaveLength(1)
  expect(
    JsonDiagnostics.getDiagnostics('{"value": 10}', boundedSchema),
  ).toEqual([])
  expect(
    JsonDiagnostics.getDiagnostics('{"value": 15}', boundedSchema),
  ).toEqual([])
  expect(
    JsonDiagnostics.getDiagnostics('{"value": 100}', boundedSchema),
  ).toEqual([])
  expect(
    JsonDiagnostics.getDiagnostics('{"value": 101}', boundedSchema),
  ).toEqual([
    expect.objectContaining({
      code: 'maximum',
      message: 'Value must be less than or equal to 100.',
    }),
  ])
})

test('applies zero bounds and ignores unbounded numbers', () => {
  expect(
    JsonDiagnostics.getDiagnostics('{"value": -1}', {
      properties: { value: { minimum: 0 } },
      type: 'object',
    }),
  ).toEqual([
    expect.objectContaining({
      code: 'minimum',
      message: 'Value must be greater than or equal to 0.',
    }),
  ])
  expect(
    JsonDiagnostics.getDiagnostics('{"value": -1}', {
      properties: { value: { type: 'number' } },
      type: 'object',
    }),
  ).toEqual([])
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
