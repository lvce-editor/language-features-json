import { AstNode } from '../AstNode/AstNode.ts'

export const findNodeAtOffset = (
  nodes: readonly AstNode[],
  offset: number,
): AstNode | undefined => {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i]
    if (node.offset >= offset) {
      return node
    }
  }
  return nodes.at(-1)
}
