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
  const offset = 10
  const textDocument = {
    uri: 'test://test.json',
    text: `{ "type": "module" }`,
  }
  expect(await worker.execute('Hover.getHover', textDocument, offset)).toEqual({
    displayString: '',
    documentation: 'test description',
  })
})
