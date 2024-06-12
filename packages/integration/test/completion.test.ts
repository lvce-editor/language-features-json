import { testWorker } from '../src/testWorker.js'
import { test, expect } from '@jest/globals'

test('completion', async () => {
  const execMap = {
    'Json.loadSchema'() {
      return {
        type: 'object',
        properties: {
          type: {
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
  const offset = 10
  const textDocument = {
    uri: 'test://test.json',
    text: `{ "type":  }`,
  }
  expect(
    await worker.execute('Completion.getCompletion', textDocument, offset),
  ).toEqual([
    {
      kind: 2,
      label: 'commonjs',
    },
    {
      kind: 2,
      label: 'module',
    },
  ])
})
