import { testWorker } from '../src/testWorker.js'
import { test, expect } from '@jest/globals'

test('enum value completion', async () => {
  const execMap = {
    'Json.loadSchema'() {
      return {
        type: 'object',
        properties: {
          moduleKind: {
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
  const text = `{ "moduleKind":  }`
  const offset = text.length - 1
  const textDocument = {
    uri: 'test://test.json',
    text,
  }
  expect(
    await worker.execute('Completion.getCompletion', textDocument, offset),
  ).toEqual([
    {
      kind: 2,
      label: 'commonjs',
      snippet: '"commonjs"',
    },
    {
      kind: 2,
      label: 'module',
      snippet: '"module"',
    },
  ])
})

test('boolean value completion', async () => {
  const execMap = {
    'Json.loadSchema'() {
      return {
        type: 'object',
        properties: {
          enabled: {
            type: 'boolean',
          },
        },
      }
    },
  }
  const worker = await testWorker({ execMap })
  const text = `{ "enabled":  }`
  const textDocument = {
    uri: 'test://boolean-test.json',
    text,
  }
  expect(
    await worker.execute(
      'Completion.getCompletion',
      textDocument,
      text.length - 1,
    ),
  ).toEqual([
    {
      kind: 2,
      label: 'true',
      snippet: 'true',
    },
    {
      kind: 2,
      label: 'false',
      snippet: 'false',
    },
  ])
})

test('resolve preserves the JSON insertion text', async () => {
  const worker = await testWorker({ execMap: {} })
  const completionItem = {
    kind: 2,
    label: 'true',
    snippet: 'true',
  }
  await expect(
    worker.execute(
      'Completion.resolve',
      { uri: 'test://resolve-test.json', text: '' },
      0,
      'true',
      completionItem,
    ),
  ).resolves.toEqual(completionItem)
})

test.each([
  ['boolean', 'enabled', '"enabled": true', 11, 15],
  ['enum', 'mode', '"mode": "first"', 8, 15],
  ['number', 'count', '"count": 42', 9, 11],
  ['string', 'name', '"name": "value"', 8, 15],
])(
  'resolve adds the %s property default selection',
  async (_type, label, snippet, startOffset, endOffset) => {
    const worker = await testWorker({ execMap: {} })
    const completionItem = {
      kind: 1,
      label,
      snippet,
    }

    await expect(
      worker.execute(
        'Completion.resolve',
        { uri: 'test://resolve-property.json', text: '{}' },
        1,
        label,
        completionItem,
      ),
    ).resolves.toEqual({
      ...completionItem,
      selectionRange: { endOffset, startOffset },
    })
  },
)

test('resolve leaves a property without a default unselected', async () => {
  const worker = await testWorker({ execMap: {} })
  const completionItem = {
    kind: 1,
    label: 'name',
    snippet: '"name": ',
  }

  await expect(
    worker.execute(
      'Completion.resolve',
      { uri: 'test://resolve-property.json', text: '{}' },
      1,
      'name',
      completionItem,
    ),
  ).resolves.toEqual(completionItem)
})
