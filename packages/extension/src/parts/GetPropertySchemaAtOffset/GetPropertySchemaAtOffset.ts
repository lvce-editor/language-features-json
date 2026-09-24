import type { AstNode } from '../AstNode/AstNode.ts'
import * as JsonCompletionProperty from '../JsonCompletionProperty/JsonCompletionProperty.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'
import * as TokenType from '../TokenType/TokenType.ts'

const parsePropertyName = (text: string, node: AstNode): string | undefined => {
  try {
    const value = JSON.parse(text.slice(node.offset, node.offset + node.length))
    return typeof value === 'string' ? value : undefined
  } catch {
    return undefined
  }
}

export const getPropertyNameAtOffset = (
  nodes: readonly AstNode[],
  text: string,
  offset: number,
): string | undefined => {
  for (let index = nodes.length - 1; index >= 0; index--) {
    const property = nodes[index]
    if (property.type !== TokenType.Property) {
      continue
    }
    const key = nodes[index + 1]
    if (
      key?.type !== TokenType.String ||
      offset <= key.offset + key.length ||
      offset > property.offset + property.length
    ) {
      continue
    }
    const propertyName = parsePropertyName(text, key)
    if (propertyName !== undefined) {
      return propertyName
    }
  }
  return undefined
}

export const getPropertySchemaAtOffset = (
  rootSchema: JsonSchema,
  nodes: readonly AstNode[],
  text: string,
  offset: number,
  schemaAtOffset: JsonSchema = rootSchema,
): JsonSchema | undefined => {
  const properties = JsonCompletionProperty.getSchemaProperties(
    rootSchema,
    schemaAtOffset,
  )
  const propertyName = getPropertyNameAtOffset(nodes, text, offset)
  return propertyName === undefined ? undefined : properties?.[propertyName]
}
