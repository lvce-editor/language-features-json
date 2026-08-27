import * as Jsonc from '../src/parts/Jsonc/Jsonc.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'
import { test, expect } from '@jest/globals'

test('boolean - true', () => {
  const text = 'true'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.Boolean,
      offset: 0,
      length: 4,
      childCount: 0,
    },
  ])
})

test('boolean - false', () => {
  const text = 'false'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.Boolean,
      offset: 0,
      length: 5,
      childCount: 0,
    },
  ])
})

test('null', () => {
  const text = 'null'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.Null,
      offset: 0,
      length: 4,
      childCount: 0,
    },
  ])
})

test('number', () => {
  const text = '23'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.Number,
      offset: 0,
      length: 2,
      childCount: 0,
    },
  ])
})

test('string', () => {
  const text = '"hello"'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.String,
      offset: 0,
      length: 7,
      childCount: 0,
    },
  ])
})

test('empty array', () => {
  const text = '[]'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.Array,
      offset: 0,
      length: 2,
      childCount: 0,
    },
  ])
})

test('array with whitespace', () => {
  const text = '[ ]'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.Array,
      offset: 0,
      length: 3,
      childCount: 0,
    },
  ])
})

test('array with number', () => {
  const text = '[ 1 ]'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.Array,
      offset: 0,
      length: 5,
      childCount: 1,
    },
    {
      type: TokenType.Number,
      offset: 2,
      length: 1,
      childCount: 0,
    },
  ])
})

test('empty object with whitespace', () => {
  const text = '{ }'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.Object,
      offset: 0,
      length: 3,
      childCount: 0,
    },
  ])
})

test('object with one property', () => {
  const text = '{ "val": 1 }'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.Object,
      offset: 0,
      length: 12,
      childCount: 1,
    },
    {
      type: TokenType.Property,
      offset: 2,
      length: 8,
      childCount: 2,
    },
    {
      type: TokenType.String,
      offset: 2,
      length: 5,
      childCount: 0,
    },
    {
      type: TokenType.Number,
      offset: 9,
      length: 1,
      childCount: 0,
    },
  ])
})

test('nested arrays', () => {
  const text = '[[], []]'
  expect(Jsonc.parse(text)).toEqual([
    {
      childCount: 2,
      length: 8,
      offset: 0,
      type: TokenType.Array,
    },
    {
      childCount: 0,
      length: 2,
      offset: 1,
      type: TokenType.Array,
    },
    {
      childCount: 0,
      length: 2,
      offset: 5,
      type: TokenType.Array,
    },
  ])
})

test('array inside object', () => {
  const text = '{"a": []}'
  expect(Jsonc.parse(text)).toEqual([
    {
      childCount: 1,
      length: 9,
      offset: 0,
      type: TokenType.Object,
    },
    {
      childCount: 2,
      length: 7,
      offset: 1,
      type: TokenType.Property,
    },
    {
      childCount: 0,
      length: 3,
      offset: 1,
      type: TokenType.String,
    },
    {
      childCount: 0,
      length: 2,
      offset: 6,
      type: TokenType.Array,
    },
  ])
})

test('object and array inside object', () => {
  const text = '{"a": {}, "b": ["."]}'
  expect(Jsonc.parse(text)).toEqual([
    {
      childCount: 2,
      length: 21,
      offset: 0,
      type: 1,
    },
    {
      childCount: 2,
      length: 7,
      offset: 1,
      type: 6,
    },
    {
      childCount: 0,
      length: 3,
      offset: 1,
      type: 4,
    },
    {
      childCount: 0,
      length: 2,
      offset: 6,
      type: 1,
    },
    {
      childCount: 2,
      length: 10,
      offset: 10,
      type: 6,
    },
    {
      childCount: 0,
      length: 3,
      offset: 10,
      type: 4,
    },
    {
      childCount: 1,
      length: 5,
      offset: 15,
      type: 2,
    },
    {
      childCount: 0,
      length: 3,
      offset: 16,
      type: 4,
    },
  ])
})
