import { expect, test } from '@jest/globals'
import { testWorker } from '../src/testWorker.ts'

test('reports syntax diagnostics without a schema and clears them for valid text', async () => {
  const worker = await testWorker({ execMap: {} })
  const textDocument = {
    uri: 'test://syntax/unknown.json',
    text: '{"name":"app" "version":"1"}',
  }
  const diagnostics = await worker.execute(
    'Diagnostic.getSyntaxDiagnostics',
    textDocument.text,
  )
  expect(diagnostics).toEqual([
    expect.objectContaining({
      code: 'syntax',
      message: 'Expected a comma between JSON values.',
      rowIndex: 0,
      columnIndex: 14,
      source: 'json (syntax)',
      type: 'error',
    }),
  ])
  expect(
    await worker.execute(
      'Diagnostic.getSyntaxDiagnostics',
      '{"name":"app","version":"1"}',
    ),
  ).toEqual([])
})
