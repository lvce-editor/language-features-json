import { expect, test } from '@jest/globals'
import { AstNode } from '../src/parts/AstNode/AstNode.ts'
import * as FindNodeAtOffset from '../src/parts/FindNodeAtOffset/FindNodeAtOffset.ts'
import * as TokenType from '../src/parts/TokenType/TokenType.ts'

test('empty', () => {
  const nodes: readonly AstNode[] = []
  const offset = 0
  expect(FindNodeAtOffset.findNodeAtOffset(nodes, offset)).toEqual(undefined)
})

test('property name', () => {
  const nodes: readonly AstNode[] = [
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
  ]
  const offset = 5
  expect(FindNodeAtOffset.findNodeAtOffset(nodes, offset)).toEqual({
    childCount: 0,
    length: 5,
    offset: 2,
    type: 4,
  })
})

test('object whitespace after a property', () => {
  const nodes: readonly AstNode[] = [
    {
      type: TokenType.Object,
      offset: 0,
      length: 15,
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
  ]

  expect(FindNodeAtOffset.findNodeAtOffset(nodes, 12)).toEqual(nodes[0])
})

test('missing property value', () => {
  const nodes: readonly AstNode[] = [
    {
      type: TokenType.Object,
      offset: 0,
      length: 12,
      childCount: 1,
    },
    {
      type: TokenType.Property,
      offset: 2,
      length: 10,
      childCount: 2,
    },
    {
      type: TokenType.String,
      offset: 2,
      length: 6,
      childCount: 0,
    },
  ]

  expect(FindNodeAtOffset.findNodeAtOffset(nodes, 10)).toEqual(nodes[2])
})
