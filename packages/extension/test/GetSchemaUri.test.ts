import { expect, test } from '@jest/globals'
import * as GetSchemaUri from '../src/parts/GetSchemaUri/GetSchemaUri.ts'

test('tsconfig', async () => {
  const uri = '/test/tsconfig.json'
  expect(await GetSchemaUri.getSchemaUri(uri)).toBe('src/tsconfig.schema.json')
})

test('builtin settings', async () => {
  expect(await GetSchemaUri.getSchemaUri('app://settings.json')).toBe(
    GetSchemaUri.settingsSchemaUri,
  )
})

test('workspace settings', async () => {
  expect(await GetSchemaUri.getSchemaUri('/test/.vscode/settings.json')).toBe(
    GetSchemaUri.settingsSchemaUri,
  )
})

test('non-settings json file', async () => {
  expect(await GetSchemaUri.getSchemaUri('/test/mysettings.json')).toBe('')
})

test('declared schema', async () => {
  expect(
    await GetSchemaUri.getSchemaUri(
      'live-component-state:///7.json',
      '{\n  "$schema": "live-component-state:///schemas/7.json"\n}',
    ),
  ).toBe('live-component-state:///schemas/7.json')
})

test('declared schema overrides the file-name schema', async () => {
  expect(
    await GetSchemaUri.getSchemaUri(
      '/test/package.json',
      '{ "$schema": "file:///test/schema.json" }',
    ),
  ).toBe('file:///test/schema.json')
})

test('ignores a nested schema declaration', async () => {
  expect(
    await GetSchemaUri.getSchemaUri(
      '/test/state.json',
      '{ "nested": { "$schema": "file:///test/schema.json" } }',
    ),
  ).toBe('')
})
