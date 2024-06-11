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
      value: true,
    },
  ])
})

test('boolean - false', () => {
  const text = 'false'
  expect(Jsonc.parse(text)).toEqual([
    {
      type: TokenType.Boolean,
      offset: 0,
      length: 4,
      childCount: 0,
      value: false,
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
      value: null,
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
      value: 23,
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
      value: 'hello',
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
