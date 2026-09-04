import { testWorker } from '../src/testWorker.ts'
import { test, expect } from '@jest/globals'

test('property-name-completion', async () => {
  const execMap = {
    'Json.loadSchema'() {
      return {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['commonjs', 'module'],
          },
          enabled: {
            default: true,
            type: 'boolean',
          },
        },
      }
    },
  }
  const worker = await testWorker({
    execMap,
  })
  const offset = 3
  const textDocument = {
    uri: 'test://test.json',
    text: `{ ""  }`,
  }
  expect(
    await worker.execute('Completion.getCompletion', textDocument, offset),
  ).toEqual([
    {
      kind: 1,
      label: 'type',
      snippet: '"type": "commonjs"',
    },
    {
      kind: 1,
      label: 'enabled',
      snippet: '"enabled": true',
    },
  ])
})
