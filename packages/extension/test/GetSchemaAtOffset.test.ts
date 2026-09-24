import { expect, test } from '@jest/globals'
import * as GetSchemaAtOffset from '../src/parts/GetSchemaAtOffset/GetSchemaAtOffset.ts'
import * as JsonCompletionProperty from '../src/parts/JsonCompletionProperty/JsonCompletionProperty.ts'
import * as Jsonc from '../src/parts/Jsonc/Jsonc.ts'

const schema = {
  properties: {
    outerOnly: { type: 'boolean' },
    nested: {
      properties: {
        innerOnly: { type: 'boolean' },
        entries: {
          items: {
            properties: {
              arrayOnly: { type: 'boolean' },
            },
          },
        },
      },
    },
  },
}

test('uses the schema of the object at the cursor', () => {
  const text = '{"nested": {"innerOnly": true}}'
  const offset = text.indexOf('innerOnly')
  const result = GetSchemaAtOffset.getSchemaAtOffset(
    schema,
    Jsonc.parse(text),
    text,
    offset,
  )
  expect(result).toBe(schema.properties.nested)
})

test('resolves object schemas inside array elements', () => {
  const text = '{"nested": {"entries": [{"arrayOnly": true}]}}'
  const offset = text.indexOf('arrayOnly')
  const result = GetSchemaAtOffset.getSchemaAtOffset(
    schema,
    Jsonc.parse(text),
    text,
    offset,
  )
  expect(result).toBe(schema.properties.nested.properties.entries.items)
})

test('resolves references and compositions for nested properties', () => {
  const rootSchema = {
    definitions: {
      nested: {
        anyOf: [
          {
            properties: {
              referenced: { type: 'boolean' },
            },
          },
        ],
      },
    },
    properties: {
      nested: {
        allOf: [{ $ref: '#/definitions/nested' }],
      },
    },
  }
  const text = '{"nested": {}}'
  const result = GetSchemaAtOffset.getSchemaAtOffset(
    rootSchema,
    Jsonc.parse(text),
    text,
    text.indexOf('{', 1) + 1,
  )
  expect(result).toEqual(rootSchema.properties.nested)
  expect(
    JsonCompletionProperty.jsonCompletionProperty(rootSchema, {
      childCount: 0,
      length: 0,
      offset: 0,
      type: 0,
    }, result).map((item) => item.label),
  ).toEqual(['referenced'])
})

test('does not fall back to root properties for an unknown nested object', () => {
  const text = '{"unknown": {"value": true}}'
  const offset = text.indexOf('value')
  const result = GetSchemaAtOffset.getSchemaAtOffset(
    schema,
    Jsonc.parse(text),
    text,
    offset,
  )
  expect(result).toEqual({})
})

test('keeps the root schema for root completions', () => {
  const text = '{"outerOnly": true}'
  const result = GetSchemaAtOffset.getSchemaAtOffset(
    schema,
    Jsonc.parse(text),
    text,
    text.indexOf('outerOnly'),
  )
  expect(result).toBe(schema)
})

test('resolves incomplete nested objects while typing', () => {
  const text = '{"nested": {'
  const result = GetSchemaAtOffset.getSchemaAtOffset(
    schema,
    Jsonc.parse(text),
    text,
    text.length,
  )
  expect(result).toBe(schema.properties.nested)
})
