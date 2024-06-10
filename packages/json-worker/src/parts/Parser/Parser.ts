import * as TokenType from '../JsoncTokenType/JsoncTokenType.ts'
import * as ParseComment from '../ParseComment/ParseComment.ts'
import * as ParseLiteral from '../ParseLiteral/ParseLiteral.ts'
import * as ParseNumber from '../ParseNumber/ParseNumber.ts'
import * as ParsePropertyColon from '../ParsePropertyColon/ParsePropertyColon.ts'
import * as ParsePropertyName from '../ParsePropertyName/ParsePropertyName.ts'
import * as ParseString from '../ParseString/ParseString.ts'

const parseObject = (scanner, ast) => {
  ast.push({
    type: 'object',
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
        const value = parseValue(scanner)
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
  return object
}

const parseArray = (scanner) => {
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

export const parseValue = (scanner) => {
  const token = scanner.scanValue()
  const ast = []
  switch (token) {
    case TokenType.CurlyOpen:
      return parseObject(scanner, ast)
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
      return parseValue(scanner)
    default:
      return undefined
  }
}
