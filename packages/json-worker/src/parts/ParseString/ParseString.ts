import type { AstNode } from '../AstNode/AstNode.ts'
import type { Scanner } from '../Scanner/Scanner.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const parseString = (scanner: Scanner, ast: AstNode[]): void => {
  scanner.goBack(1)
  const offset = scanner.getOffset()
  const value = scanner.scanString()
  const length = scanner.getOffset() - offset
  ast.push({
    type: TokenType.String,
    offset,
    length,
    childCount: 0,
  })
  return value
}
