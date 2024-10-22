import { expect, test } from '@jest/globals'
import * as schema from '../src/package.schema.json'

test('schema', () => {
  expect(schema).toBeDefined()
})
