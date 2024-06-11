import type { AstNode } from '../AstNode/AstNode.ts'
import type { Scanner } from '../Scanner/Scanner.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const parseNumber = (scanner: Scanner, ast: AstNode[]): void => {
  scanner.goBack(1)
  const offset = scanner.getOffset()
  scanner.scanNumber()
  const length = scanner.getOffset() - offset
  ast.push({
    type: TokenType.Number,
    offset,
    length,
    childCount: 0,
  })
}
