import { expect, test } from '@jest/globals'
import * as schema from '../src/tsconfig.schema.json'

test('schema', () => {
  expect(schema).toBeDefined()
})
