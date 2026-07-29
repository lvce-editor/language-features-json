import { expect, test } from '@jest/globals'
import { testWorker } from '../src/testWorker.ts'

const packageSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
}

const prettierPackageSchema = {
  type: 'object',
  properties: {
    prettier: {
      type: 'object',
      properties: {
        semi: { type: 'boolean' },
        singleQuote: { type: 'boolean' },
        printWidth: { type: 'integer' },
        trailingComma: { type: 'string', enum: ['all', 'es5', 'none'] },
      },
    },
  },
}

const createWorker = async () => {
  return testWorker({
    execMap: {
      'Json.loadSchema'(input: string) {
        return input.endsWith('/prettier-package.schema.json')
          ? prettierPackageSchema
          : packageSchema
      },
    },
    jsonSchemas: [
      {
        fileMatch: 'package.json',
        url: 'https://example.com/prettier-package.schema.json',
      },
    ],
  })
}

test('combines root properties from the built-in and contributed schemas', async () => {
  const worker = await createWorker()
  const textDocument = {
    uri: 'test://completion-root/package.json',
    text: '{ "" }',
  }
  const result = await worker.execute(
    'Completion.getCompletion',
    textDocument,
    3,
  )
  expect(result).toEqual(
    expect.arrayContaining([
      { kind: 1, label: 'name' },
      { kind: 1, label: 'prettier' },
    ]),
  )
})

test('completes prettier option names inside package.json', async () => {
  const worker = await createWorker()
  const textDocument = {
    uri: 'test://completion-options/package.json',
    text: '{ "prettier": { "sem" } }',
  }
  const result = await worker.execute(
    'Completion.getCompletion',
    textDocument,
    21,
  )
  expect(result).toEqual(
    expect.arrayContaining([
      { kind: 1, label: 'semi' },
      { kind: 1, label: 'singleQuote' },
      { kind: 1, label: 'printWidth' },
      { kind: 1, label: 'trailingComma' },
    ]),
  )
})

test('completes enum values from the contributed schema', async () => {
  const worker = await createWorker()
  const textDocument = {
    uri: 'test://completion-enum/package.json',
    text: '{ "prettier": { "trailingComma":  } }',
  }
  expect(
    await worker.execute('Completion.getCompletion', textDocument, 34),
  ).toEqual([
    { kind: 2, label: 'all' },
    { kind: 2, label: 'es5' },
    { kind: 2, label: 'none' },
  ])
})

test('reports an invalid prettier option type', async () => {
  const worker = await createWorker()
  const textDocument = {
    uri: 'test://diagnostic-type/package.json',
    text: '{ "prettier": { "semi": "no" } }',
  }
  expect(
    await worker.execute('Diagnostic.getDiagnostics', textDocument),
  ).toEqual([
    expect.objectContaining({
      code: 'type',
      message: 'Incorrect type. Expected "boolean" but received "string".',
      source: 'json',
      type: 'error',
    }),
  ])
})

test('reports an invalid prettier enum value', async () => {
  const worker = await createWorker()
  const textDocument = {
    uri: 'test://diagnostic-enum/package.json',
    text: '{ "prettier": { "trailingComma": "sometimes" } }',
  }
  expect(
    await worker.execute('Diagnostic.getDiagnostics', textDocument),
  ).toEqual([
    expect.objectContaining({
      code: 'enum',
      message: 'Value is not accepted. Valid values: "all", "es5", "none".',
    }),
  ])
})

test('accepts valid prettier configuration values', async () => {
  const worker = await createWorker()
  const textDocument = {
    uri: 'test://diagnostic-valid/package.json',
    text: '{ "prettier": { "semi": false, "printWidth": 100, "trailingComma": "all" } }',
  }
  expect(
    await worker.execute('Diagnostic.getDiagnostics', textDocument),
  ).toEqual([])
})

test('does not apply the contribution to other JSON files', async () => {
  const worker = await createWorker()
  const textDocument = {
    uri: 'test://other/settings.json',
    text: '{ "prettier": { "semi": "no" } }',
  }
  expect(
    await worker.execute('Diagnostic.getDiagnostics', textDocument),
  ).toEqual([])
})
