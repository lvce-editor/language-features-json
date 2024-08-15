import { expect, test } from '@jest/globals'
import * as GetSchemaUri from '../src/parts/GetSchemaUri/GetSchemaUri.ts'

test('tsconfig', () => {
  const uri = '/test/tsconfig.json'
  expect(GetSchemaUri.getSchemaUri(uri)).toBe('src/tsconfig.schema.json')
})
