import { jest, test, expect } from '@jest/globals'
import * as JsonCompletionProperty from '../src/parts/JsonCompletionProperty/JsonCompletionProperty.ts'

test.skip('handles schema references', () => {
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
      kind: 10,
      label: 'compilerOptions',
    },
  ])
})
