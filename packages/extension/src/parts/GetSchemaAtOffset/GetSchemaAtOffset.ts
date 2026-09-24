import type { AstNode } from '../AstNode/AstNode.ts'
import * as JsonCompletionProperty from '../JsonCompletionProperty/JsonCompletionProperty.ts'
import * as GetPropertySchemaAtOffset from '../GetPropertySchemaAtOffset/GetPropertySchemaAtOffset.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'
import * as TokenType from '../TokenType/TokenType.ts'

const containsOffset = (node: AstNode, offset: number): boolean => {
  return node.offset <= offset && offset <= node.offset + node.length
}

const getParentPropertyName = (
  nodes: readonly AstNode[],
  parent: AstNode,
  child: AstNode,
  text: string,
): string | undefined => {
  let property: AstNode | undefined
  for (const node of nodes) {
    if (
      node.type === TokenType.Property &&
      parent.offset <= node.offset &&
      node.offset <= child.offset &&
      node.offset + node.length >= child.offset &&
      (!property || node.length < property.length)
    ) {
      property = node
    }
  }
  if (!property) {
    return undefined
  }
  const key = nodes[nodes.indexOf(property) + 1]
  if (key?.type !== TokenType.String) {
    return undefined
  }
  try {
    const value: unknown = JSON.parse(text.slice(key.offset, key.offset + key.length))
    return typeof value === 'string' ? value : undefined
  } catch {
    return undefined
  }
}

export const getSchemaAtOffset = (
  rootSchema: JsonSchema,
  nodes: readonly AstNode[],
  text: string,
  offset: number,
): JsonSchema => {
  const containers = nodes
    .filter(
      (node) =>
        (node.type === TokenType.Object || node.type === TokenType.Array) &&
        containsOffset(node, offset),
    )
    .sort((a, b) => b.length - a.length)

  let schema = rootSchema
  for (let index = 1; index < containers.length; index++) {
    const parent = containers[index - 1]
    const child = containers[index]
    if (parent.type === TokenType.Array) {
      schema = schema.items || {}
      continue
    }
    const propertyName = getParentPropertyName(nodes, parent, child, text)
    if (propertyName === undefined) {
      return {}
    }
    const properties = JsonCompletionProperty.getSchemaProperties(
      rootSchema,
      schema,
    )
    schema = properties?.[propertyName] || {}
  }
  return schema
}
