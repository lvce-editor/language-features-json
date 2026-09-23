import * as PrepareJsonDocument from '../PrepareJsonDocument/PrepareJsonDocument.ts'
import type { AstNode } from '../AstNode/AstNode.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'
import * as TokenType from '../TokenType/TokenType.ts'

const getPropertyPath = (
  nodes: readonly AstNode[],
  text: string,
  offset: number,
): readonly string[] => {
  const properties: AstNode[] = []
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (node.type !== TokenType.Property) {
      continue
    }
    const keyNode = nodes[i + 1]
    if (!keyNode || keyNode.type !== TokenType.String) {
      continue
    }
    const keyStart = keyNode.offset
    const keyEnd = keyStart + keyNode.length
    if (offset >= keyStart && offset < keyEnd) {
      properties.push(node)
    }
  }
  const target = properties.at(-1)
  if (!target) {
    return []
  }
  return nodes
    .flatMap((node, i) => {
      if (node.type !== TokenType.Property) {
        return []
      }
      const keyNode = nodes[i + 1]
      if (
        !keyNode ||
        keyNode.type !== TokenType.String ||
        node.offset > target.offset ||
        node.offset + node.length < target.offset + target.length
      ) {
        return []
      }
      return [
        {
          offset: node.offset,
          key: text.slice(
            keyNode.offset + 1,
            keyNode.offset + keyNode.length - 1,
          ),
        },
      ]
    })
    .sort((a, b) => a.offset - b.offset)
    .map(({ key }) => key)
}

const getReferencedSchema = (schema: JsonSchema, ref: string): JsonSchema => {
  if (!ref.startsWith('#/')) {
    return {}
  }
  const path = ref
    .slice(2)
    .split('/')
    .map((part) => part.replaceAll('~1', '/').replaceAll('~0', '~'))
  let current: unknown = schema
  for (const part of path) {
    if (!current || typeof current !== 'object') {
      return {}
    }
    current = (current as Record<string, unknown>)[part]
  }
  return current && typeof current === 'object' ? (current as JsonSchema) : {}
}

const getApplicableSchemas = (
  schema: JsonSchema,
  root: JsonSchema,
  visited = new Set<JsonSchema>(),
): readonly JsonSchema[] => {
  if (!schema || typeof schema !== 'object' || visited.has(schema)) {
    return []
  }
  visited.add(schema)
  const result: JsonSchema[] = [schema]
  if (schema.$ref) {
    result.push(
      ...getApplicableSchemas(
        getReferencedSchema(root, schema.$ref),
        root,
        visited,
      ),
    )
  }
  for (const key of ['allOf', 'anyOf', 'oneOf'] as const) {
    for (const item of schema[key] || []) {
      result.push(...getApplicableSchemas(item, root, visited))
    }
  }
  return result
}

const getPropertySchema = (
  schemas: readonly JsonSchema[],
  key: string,
): JsonSchema => {
  for (const schema of schemas) {
    if (schema.properties?.[key]) {
      return schema.properties[key]
    }
    if (
      schema.additionalProperties &&
      typeof schema.additionalProperties === 'object'
    ) {
      return schema.additionalProperties
    }
  }
  return {}
}

const getDocumentation = (schema: JsonSchema, root: JsonSchema): string => {
  const applicable = getApplicableSchemas(schema, root)
  for (const item of applicable) {
    const documentation =
      item.description || item.markdownDescription || item.title
    if (documentation) {
      return documentation
    }
  }
  return ''
}

export const getHover = async (textDocument, offset) => {
  const parsed = await PrepareJsonDocument.prepareJsonDocument(
    textDocument,
    offset,
  )
  if (parsed === PrepareJsonDocument.emptyDocument) {
    return undefined
  }
  const { schema, nodes } = parsed
  const path = getPropertyPath(nodes, textDocument.text, offset)
  if (path.length) {
    let current: JsonSchema = schema
    for (const key of path) {
      const applicable = getApplicableSchemas(current, schema)
      current = getPropertySchema(applicable, key)
    }
    return {
      displayString: '',
      documentation: getDocumentation(current, schema),
    }
  }
  return undefined
}
