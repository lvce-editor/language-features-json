import { AstNode } from '../AstNode/AstNode.ts'
import * as TokenType from '../JsoncTokenType/JsoncTokenType.ts'
import * as ParseComment from '../ParseComment/ParseComment.ts'
import * as ParseLiteral from '../ParseLiteral/ParseLiteral.ts'
import * as ParseNumber from '../ParseNumber/ParseNumber.ts'
import * as ParsePropertyColon from '../ParsePropertyColon/ParsePropertyColon.ts'
import * as ParsePropertyName from '../ParsePropertyName/ParsePropertyName.ts'
import * as ParseString from '../ParseString/ParseString.ts'
import { Scanner } from '../Scanner/Scanner.ts'
import * as ParserTokenType from '../TokenType/TokenType.ts'

const parseObject = (scanner, ast) => {
  ast.push({
    type: ParserTokenType.Object,
  })
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
        const value = parseValueInternal(scanner, ast)
        object[propertyName] = value
      case TokenType.Comma:
        break
      case TokenType.Slash:
        ParseComment.parseComment(scanner, ast)
        break
      case TokenType.Literal:
        ParseLiteral.parseLiteral(scanner, ast)
        break
      default:
        break
    }
  }
  return object
}

const parseArray = (scanner: Scanner, ast: AstNode[]): void => {
  const node: AstNode = {
    type: ParserTokenType.Array,
    offset: scanner.getOffset() - 1,
    length: 0,
    childCount: 0,
  }
  ast.push({
    type: ParserTokenType.Array,
    offset: scanner.getOffset() - 1,
    length: 0,
    childCount: 0,
  })
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
        const value = parseValueInternal(scanner, ast)
        array.push(value)
        break
      case TokenType.Comma:
        break
    }
  }
  // node.childCount = array.length
  // node.length = scanner.getOffset() - node.offset
}

export const parseValueInternal = (
  scanner: Scanner,
  ast: AstNode[],
): readonly AstNode[] => {
  const token = scanner.scanValue()
  switch (token) {
    case TokenType.CurlyOpen:
      parseObject(scanner, ast)
      break
    case TokenType.DoubleQuote:
      ParseString.parseString(scanner, ast)
      break
    case TokenType.Numeric:
      ParseNumber.parseNumber(scanner)
      break
    case TokenType.SquareOpen:
      parseArray(scanner, ast)
      break
    case TokenType.Literal:
      ParseLiteral.parseLiteral(scanner, ast)
      break
    case TokenType.Slash:
      ParseComment.parseComment(scanner, ast)
      parseValueInternal(scanner, ast)
      break
    default:
      break
  }
  return ast
}

export const parseValue = (scanner: Scanner): readonly AstNode[] => {
  const ast: AstNode[] = []
  return parseValueInternal(scanner, ast)
}
