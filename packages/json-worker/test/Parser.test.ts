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
