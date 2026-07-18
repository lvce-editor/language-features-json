import { expect, test } from '@jest/globals'
import * as GetSchemaUri from '../src/parts/GetSchemaUri/GetSchemaUri.ts'

test('tsconfig', async () => {
  const uri = '/test/tsconfig.json'
  expect(await GetSchemaUri.getSchemaUri(uri)).toBe('src/tsconfig.schema.json')
})
