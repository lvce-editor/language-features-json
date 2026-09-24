import { expect, test } from '@jest/globals'
import { testWorker } from '../src/testWorker.js'

const packageUri =
  'remote-ssh://192.0.2.1/home/simon/project/package.json'

const packageSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'The package name.',
    },
    type: {
      type: 'string',
      enum: ['commonjs', 'module'],
    },
  },
}

const createWorker = async () => {
  return testWorker({
    execMap: {
      'Json.loadSchema'() {
        return packageSchema
      },
    },
  })
}

test('provides package property hover for a remote-ssh URI', async () => {
  const worker = await createWorker()
  const textDocument = {
    uri: packageUri,
    text: '{ "name": "app" }',
  }

  expect(
    await worker.execute('Hover.getHover', textDocument, 4),
  ).toMatchObject({
    documentation: 'The package name.',
  })
  expect(worker.invocations).toHaveLength(1)
})

test('reports and clears malformed package JSON diagnostics for a remote-ssh URI', async () => {
  const worker = await createWorker()
  const malformedDocument = {
    uri: packageUri,
    text: '{ "name" "app" }',
  }

  expect(
    await worker.execute('Diagnostic.getDiagnostics', malformedDocument),
  ).toEqual([
    expect.objectContaining({
      code: 'syntax',
      columnIndex: 9,
      message: 'Expected a colon after the property name.',
      rowIndex: 0,
      source: 'json (syntax)',
      type: 'error',
    }),
  ])

  expect(
    await worker.execute('Diagnostic.getDiagnostics', {
      ...malformedDocument,
      text: '{ "name": "app" }',
    }),
  ).toEqual([])
})

test('keeps package enum completions working for a remote-ssh URI', async () => {
  const worker = await createWorker()
  const textDocument = {
    uri: packageUri,
    text: '{ "type":  }',
  }

  expect(
    await worker.execute(
      'Completion.getCompletion',
      textDocument,
      textDocument.text.length - 1,
    ),
  ).toEqual([
    { kind: 2, label: 'commonjs', snippet: '"commonjs"' },
    { kind: 2, label: 'module', snippet: '"module"' },
  ])
})
