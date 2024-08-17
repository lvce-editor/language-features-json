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
