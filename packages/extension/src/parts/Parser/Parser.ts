import type { AstNode } from '../AstNode/AstNode.ts'
import * as TokenType from '../JsoncTokenType/JsoncTokenType.ts'
import * as ParseComment from '../ParseComment/ParseComment.ts'
import * as ParseLiteral from '../ParseLiteral/ParseLiteral.ts'
import * as ParseNumber from '../ParseNumber/ParseNumber.ts'
import * as ParsePropertyColon from '../ParsePropertyColon/ParsePropertyColon.ts'
import * as ParsePropertyName from '../ParsePropertyName/ParsePropertyName.ts'
import * as ParseString from '../ParseString/ParseString.ts'
import type { Scanner } from '../Scanner/Scanner.ts'
import * as ParserTokenType from '../TokenType/TokenType.ts'

const parseProperty = (scanner: Scanner): readonly AstNode[] => {
  scanner.goBack(1)
  const offset = scanner.getOffset()
  const nodes: AstNode[] = []
  nodes.push(...ParsePropertyName.parsePropertyName(scanner))
  ParsePropertyColon.parsePropertyColon(scanner)
  const value = parseValueInternal(scanner)
  nodes.push(...value)
  const length = scanner.getOffset() - offset
  nodes.unshift({
    type: ParserTokenType.Property,
    offset,
    length,
    childCount: 2,
  })
  return nodes
}

const parseObject = (scanner: Scanner): readonly AstNode[] => {
  const nodes: AstNode[] = []
  let childCount = 0
  const offset = scanner.getOffset() - 1
  outer: while (true) {
    const token = scanner.scanValue()
    switch (token) {
      case TokenType.Eof:
      case TokenType.None:
      case TokenType.CurlyClose:
        break outer
      case TokenType.DoubleQuote:
        childCount++
        const value = parseProperty(scanner)
        nodes.push(...value)
      case TokenType.Comma:
        break
      case TokenType.Slash:
        ParseComment.parseComment(scanner)
        break
      case TokenType.Literal:
        ParseLiteral.parseLiteral(scanner)
        break
      default:
        break
    }
  }
  nodes.unshift({
    type: ParserTokenType.Object,
    offset,
    length: scanner.getOffset() - offset,
    childCount,
  })
  return nodes
}

const parseArray = (scanner: Scanner): readonly AstNode[] => {
  const nodes: AstNode[] = []
  const offset = scanner.getOffset() - 1
  let childCount = 0
  outer: while (true) {
    const token = scanner.scanValue()
    switch (token) {
      case TokenType.Eof:
      case TokenType.None:
      case TokenType.SquareClose:
        break outer
      case TokenType.Slash:
        scanner.scanComment()
        break
      case TokenType.Comma:
        break
      default:
        childCount++
        scanner.goBack(1)
        const value = parseValueInternal(scanner)
        nodes.push(...value)
        break
    }
  }
  const length = scanner.getOffset() - offset
  nodes.unshift({
    type: ParserTokenType.Array,
    offset,
    length,
    childCount,
  })
  return nodes
}

const parseValueInternal = (scanner: Scanner): readonly AstNode[] => {
  const token = scanner.scanValue()
  switch (token) {
    case TokenType.CurlyOpen:
      return parseObject(scanner)
    case TokenType.DoubleQuote:
      return ParseString.parseString(scanner)
    case TokenType.Numeric:
      return ParseNumber.parseNumber(scanner)
    case TokenType.SquareOpen:
      return parseArray(scanner)
    case TokenType.Literal:
      return ParseLiteral.parseLiteral(scanner)
    case TokenType.Slash:
      ParseComment.parseComment(scanner)
      return parseValueInternal(scanner)
    default:
      return []
  }
}

export const parseValue = (scanner: Scanner): readonly AstNode[] => {
  return parseValueInternal(scanner)
}
