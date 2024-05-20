import * as Selection from '../src/parts/Selection/Selection.ts'
import { test, expect } from '@jest/globals'

test('expand', () => {
  const textDocument = {
    text: `"abc"`,
  }
  const positions = new Uint32Array([0, 2, 0, 2])
  expect(Selection.expand(textDocument, positions)).toEqual([0, -1, 0, 2])
})
