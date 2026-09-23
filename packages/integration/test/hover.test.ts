import { testWorker } from '../src/testWorker.js'
import { test, expect } from '@jest/globals'

test('hover', async () => {
  const execMap = {
    'Json.loadSchema'() {
      return {
        type: 'object',
        properties: {
          type: {
            description: 'test description',
            type: 'string',
            enum: ['commonjs', 'module'],
          },
        },
      }
    },
  }
  const worker = await testWorker({
    execMap,
  })
  const offset = 7
  const textDocument = {
    uri: 'test://test.json',
    text: `{ "type": "module" }`,
  }
  expect(await worker.execute('Hover.getHover', textDocument, offset)).toEqual({
    displayString: '',
    documentation: 'test description',
  })
})

test('with definitions', async () => {
  const execMap = {
    'Json.loadSchema'() {
      return {
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
                description:
                  'Instructs the TypeScript compiler how to compile .ts files.',
                properties: {},
              },
            },
          },
        },
        type: 'object',
      }
    },
  }
  const worker = await testWorker({
    execMap,
  })
  const offset = 7
  const textDocument = {
    uri: 'test://tsconfig.json',
    text: `{ "compilerOptions": {} }`,
  }
  expect(await worker.execute('Hover.getHover', textDocument, offset)).toEqual({
    displayString: '',
    documentation:
      'Instructs the TypeScript compiler how to compile .ts files.',
  })
})

test('with definitions - nested property', async () => {
  const execMap = {
    'Json.loadSchema'() {
      return {
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
                description:
                  'Instructs the TypeScript compiler how to compile .ts files.',
                properties: {
                  composite: {
                    description:
                      'Enable constraints that allow a TypeScript project to be used with project references.',
                    type: 'boolean',
                    default: true,
                    markdownDescription:
                      'Enable constraints that allow a TypeScript project to be used with project references.\n\nSee more: https://www.typescriptlang.org/tsconfig#composite',
                  },
                },
              },
            },
          },
        },
        type: 'object',
      }
    },
  }
  const worker = await testWorker({
    execMap,
  })
  const text = `{
  "$schema": "https://example.com/tsconfig-nested.schema.json",
  "compilerOptions": {
    "composite": true
  }
}
`
  const offset = text.indexOf('"composite"') + 3
  const textDocument = {
    uri: 'test://tsconfig-nested.json',
    text,
  }
  expect(await worker.execute('Hover.getHover', textDocument, offset)).toEqual({
    displayString: '',
    documentation:
      'Enable constraints that allow a TypeScript project to be used with project references.',
  })
})

test('with additional properties and allOf references', async () => {
  const execMap = {
    'Json.loadSchema'() {
      return {
        type: 'object',
        properties: {
          workspaces: {
            additionalProperties: {
              allOf: [{ $ref: '#/definitions/workspace' }],
            },
          },
        },
        definitions: {
          workspace: {
            type: 'object',
            properties: {
              project: {
                description: 'Files to include in this workspace.',
              },
            },
          },
        },
      }
    },
  }
  const worker = await testWorker({ execMap })
  const text =
    '{ "$schema": "https://example.com/knip.schema.json", "workspaces": { "packages/core": { "project": [] } } }'
  const offset = text.indexOf('"project"') + 3
  expect(
    await worker.execute(
      'Hover.getHover',
      {
        uri: 'test://knip.json',
        text,
      },
      offset,
    ),
  ).toEqual({
    displayString: '',
    documentation: 'Files to include in this workspace.',
  })
})
