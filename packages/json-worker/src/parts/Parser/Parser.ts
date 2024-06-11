import { AstNode } from '../AstNode/AstNode.ts'
import * as TokenType from '../JsoncTokenType/JsoncTokenType.ts'
import * as ParseComment from '../ParseComment/ParseComment.ts'
import * as ParseLiteral from '../ParseLiteral/ParseLiteral.ts'
import * as ParseNumber from '../ParseNumber/ParseNumber.ts'
import * as ParsePropertyColon from '../ParsePropertyColon/ParsePropertyColon.ts'
import * as ParsePropertyName from '../ParsePropertyName/ParsePropertyName.ts'
import * as ParseString from '../ParseString/ParseString.ts'
import type { Scanner } from '../Scanner/Scanner.ts'
import * as ParserTokenType from '../TokenType/TokenType.ts'

const parseObject = (scanner: Scanner): readonly AstNode[] => {
  // ast.push({
  //   type: ParserTokenType.Object,
  // })
  const object = {}
  outer: while (true) {
    const token = scanner.scanValue()
    switch (token) {
      case TokenType.Eof:
      case TokenType.None:
      case TokenType.CurlyClose:
        break outer
      case TokenType.DoubleQuote:
        scanner.goBack(1)
        const propertyName = ParsePropertyName.parsePropertyName(scanner)
        ParsePropertyColon.parsePropertyColon(scanner)
        const value = parseValueInternal(scanner)
        object[propertyName] = value
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
  return []
  // return object
}

const parseArray = (scanner: Scanner): readonly AstNode[] => {
  // const node: AstNode = {
  //   type: ParserTokenType.Array,
  //   offset: scanner.getOffset() - 1,
  //   length: 0,
  //   childCount: 0,
  // }
  // ast.push({
  //   type: ParserTokenType.Array,
  //   offset: scanner.getOffset() - 1,
  //   length: 0,
  //   childCount: 0,
  // })
  const array: any[] = []
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
      default:
        scanner.goBack(1)
        const value = parseValueInternal(scanner)
        array.push(value)
        break
      case TokenType.Comma:
        break
    }
  }
  return []
  // node.childCount = array.length
  // node.length = scanner.getOffset() - node.offset
}

export const parseValueInternal = (scanner: Scanner): readonly AstNode[] => {
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
