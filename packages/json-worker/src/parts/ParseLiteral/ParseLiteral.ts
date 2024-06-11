import * as Literal from '../Literal/Literal.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const parseLiteral = (scanner, ast) => {
  const rawValue = scanner.scanLiteral()
  switch (rawValue) {
    case Literal.True:
      ast.push({
        type: TokenType.Boolean,
        offset: 0,
        length: 4,
        childCount: 0,
      })
      return true
    case Literal.False:
      return false
    case Literal.Null:
      return null
    default:
      return undefined
  }
}
