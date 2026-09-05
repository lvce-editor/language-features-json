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

test('accepts negative main area state indices without losing following properties', () => {
  const state = { pointerDownGroupIndex: -1, pointerDownTabIndex: -1, uid: 2 }
  const stateSchema = {
    properties: {
      pointerDownGroupIndex: { type: 'integer' },
      pointerDownTabIndex: { type: 'integer' },
      uid: { type: 'integer' },
    },
    type: 'object',
  }
  expect(
    JsonDiagnostics.getDiagnostics(JSON.stringify(state, null, 2), stateSchema),
  ).toEqual([])
  expect(
    JsonDiagnostics.getDiagnostics(
      JSON.stringify({ ...state, uid: 'invalid' }),
      stateSchema,
    ),
  ).toEqual([
    expect.objectContaining({
      message: 'Incorrect type. Expected "integer" but received "string".',
    }),
  ])
})

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
