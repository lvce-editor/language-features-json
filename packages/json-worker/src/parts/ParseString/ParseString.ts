import type { AstNode } from '../AstNode/AstNode.ts'
import type { Scanner } from '../Scanner/Scanner.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const parseString = (scanner: Scanner): readonly AstNode[] => {
  scanner.goBack(1)
  const offset = scanner.getOffset()
  const length = scanner.getOffset() - offset
  return [
    {
      type: TokenType.String,
      offset,
      length,
      childCount: 0,
    },
  ]
}
