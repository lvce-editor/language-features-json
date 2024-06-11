import type { AstNode } from '../AstNode/AstNode.ts'
import type { Scanner } from '../Scanner/Scanner.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const parsePropertyName = (scanner: Scanner): readonly AstNode[] => {
  const offset = scanner.getOffset()
  scanner.scanPropertyName()
  return [
    {
      type: TokenType.Property,
      offset,
      length: scanner.getOffset() - offset,
      childCount: 0,
    },
  ]
}
