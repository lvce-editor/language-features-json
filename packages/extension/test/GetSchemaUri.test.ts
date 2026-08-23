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
