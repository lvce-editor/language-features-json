import type { AstNode } from '../AstNode/AstNode.ts'
import * as Literal from '../Literal/Literal.ts'
import type { Scanner } from '../Scanner/Scanner.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const parseLiteral = (scanner: Scanner): readonly AstNode[] => {
  const offset = scanner.getOffset()
  const rawValue = scanner.scanLiteral()
  switch (rawValue) {
    case Literal.True:
      return [
        {
          type: TokenType.Boolean,
          offset,
          length: rawValue.length,
          childCount: 0,
        },
      ]
    case Literal.False:
      return [
        {
          type: TokenType.Boolean,
          offset,
          length: rawValue.length,
          childCount: 0,
        },
      ]
    case Literal.Null:
      return [
        {
          type: TokenType.Null,
          offset,
          length: rawValue.length,
          childCount: 0,
        },
      ]
    default:
      return []
  }
}
