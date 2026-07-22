import {
  findNodeAtOffset,
  getNodePath,
  parseTree,
  type Node,
} from 'jsonc-parser'

export interface CompletionContext {
  readonly kind: 'property' | 'value'
  readonly path: readonly (number | string)[]
}

const getContainingObject = (node: Node | undefined): Node | undefined => {
  let current = node
  while (current && current.type !== 'object') {
    current = current.parent
  }
  return current
}

export const getCompletionContext = (
  text: string,
  offset: number,
): CompletionContext | undefined => {
  const root = parseTree(text)
  if (!root) {
    return undefined
  }
  const lookupOffset = Math.max(0, Math.min(offset, text.length) - 1)
  const node = findNodeAtOffset(root, lookupOffset, true)
  const beforeCursor = text.slice(0, offset)
  const missingValue = /"((?:\\.|[^"\\])*)"\s*:\s*$/.exec(beforeCursor)
  if (missingValue) {
    const object = getContainingObject(node)
    return {
      kind: 'value',
      path: [...(object ? getNodePath(object) : []), missingValue[1]],
    }
  }
  if (node?.type === 'string' && node.parent?.type === 'property') {
    if (node.parent.children?.[0] === node) {
      return {
        kind: 'property',
        path: getNodePath(node.parent.parent!),
      }
    }
    return {
      kind: 'value',
      path: getNodePath(node),
    }
  }
  const object = getContainingObject(node)
  if (object) {
    return {
      kind: 'property',
      path: getNodePath(object),
    }
  }
  return undefined
}
