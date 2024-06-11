import { AstNode } from '../AstNode/AstNode.ts'

export const findNodeAtOffset = (
  nodes: readonly AstNode[],
  offset: number,
): AstNode | undefined => {
  for (const node of nodes) {
    if (node.offset + node.length >= offset) {
      return node
    }
  }
  return nodes.at(-1)
}
