import type { AstNode } from '../AstNode/AstNode.ts'
import * as Literal from '../Literal/Literal.ts'
import type { Scanner } from '../Scanner/Scanner.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const parseLiteral = (scanner: Scanner, ast: AstNode[]) => {
  const rawValue = scanner.scanLiteral()
  switch (rawValue) {
    case Literal.True:
      ast.push({
        type: TokenType.Boolean,
        offset: 0,
        length: rawValue.length,
        childCount: 0,
      })
      return true
    case Literal.False:
      ast.push({
        type: TokenType.Boolean,
        offset: 0,
        length: rawValue.length,
        childCount: 0,
      })
      return false
    case Literal.Null:
      ast.push({
        type: TokenType.Null,
        offset: 0,
        length: rawValue.length,
        childCount: 0,
      })
      return null
    default:
      return undefined
  }
}
