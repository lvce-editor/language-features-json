import { AstNode } from '../AstNode/AstNode.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const findNodeAtOffset = (
  nodes: readonly AstNode[],
  offset: number,
): AstNode | undefined => {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i]
    if (node.offset <= offset && offset < node.offset + node.length) {
      if (node.type === TokenType.Property) {
        return nodes[i + 1]
      }
      return nodes[i]
    }
  }
  return nodes.at(-1)
}
