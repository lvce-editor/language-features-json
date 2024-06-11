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
        const value = parseValue(scanner, ast)
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

const parseArray = (scanner, ast) => {
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
        const value = parseValue(scanner)
        array.push(value)
        break
      case TokenType.Comma:
        break
    }
  }
  return array
}

export const parseValue = (scanner: Scanner, ast = []): readonly AstNode[] => {
  const token = scanner.scanValue()
  switch (token) {
    case TokenType.CurlyOpen:
      parseObject(scanner, ast)
      break
    case TokenType.DoubleQuote:
      ParseString.parseString(scanner, ast)
      break
    case TokenType.Numeric:
      ParseNumber.parseNumber(scanner, ast)
      break
    case TokenType.SquareOpen:
      parseArray(scanner, ast)
      break
    case TokenType.Literal:
      ParseLiteral.parseLiteral(scanner, ast)
      break
    case TokenType.Slash:
      ParseComment.parseComment(scanner, ast)
      parseValue(scanner, ast)
      break
    default:
      break
  }
  return ast
}
