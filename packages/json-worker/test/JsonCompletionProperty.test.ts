import { jest, test, expect } from '@jest/globals'
import * as JsonCompletionProperty from '../src/parts/JsonCompletionProperty/JsonCompletionProperty.ts'
import * as CompletionType from '../src/parts/CompletionType/CompletionType.ts'

test('handles schema references', () => {
  const schema = {
    allOf: [
      {
        $ref: '#/definitions/compilerOptionsDefinition',
      },
    ],
    definitions: {
      compilerOptionsDefinition: {
        properties: {
          compilerOptions: {
            type: 'object',
            properties: {
              target: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  }

  const node = {
    type: 0,
    offset: 0,
    length: 0,
    childCount: 0,
  }

  const result = JsonCompletionProperty.jsonCompletionProperty(schema, node)
  expect(result).toEqual([
    {
      kind: CompletionType.Property,
      label: 'compilerOptions',
    },
  ])
})
