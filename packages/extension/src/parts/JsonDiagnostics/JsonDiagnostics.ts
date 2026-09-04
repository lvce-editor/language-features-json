import type { Diagnostic } from '@lvce-editor/api'
import type { AstNode } from '../AstNode/AstNode.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'
import * as Jsonc from '../Jsonc/Jsonc.ts'
import * as TokenType from '../TokenType/TokenType.ts'

const typeNames = new Map([
  [TokenType.Object, 'object'],
  [TokenType.Array, 'array'],
  [TokenType.Number, 'number'],
  [TokenType.String, 'string'],
  [TokenType.Boolean, 'boolean'],
  [TokenType.Null, 'null'],
])

const getSubtreeEnd = (nodes: readonly AstNode[], index: number): number => {
  const node = nodes[index]
  if (!node) {
    return nodes.length
  }
  let end = index + 1
  let remaining = node.childCount
  while (remaining > 0 && end < nodes.length) {
    const child = nodes[end]
    remaining += child.childCount - 1
    end++
  }
  return end
}

const parseValue = (text: string, node: AstNode): unknown => {
  try {
    return JSON.parse(text.slice(node.offset, node.offset + node.length))
  } catch {
    return undefined
  }
}

const getPosition = (
  text: string,
  offset: number,
): { readonly columnIndex: number; readonly rowIndex: number } => {
  let columnIndex = 0
  let rowIndex = 0
  for (let i = 0; i < offset; i++) {
    if (text.charCodeAt(i) === 10) {
      columnIndex = 0
      rowIndex++
    } else {
      columnIndex++
    }
  }
  return { columnIndex, rowIndex }
}

const createDiagnostic = (
  text: string,
  node: AstNode,
  code: string,
  message: string,
): Diagnostic => {
  const start = getPosition(text, node.offset)
  const end = getPosition(text, node.offset + node.length)
  return {
    ...start,
    code,
    endColumnIndex: end.columnIndex,
    endRowIndex: end.rowIndex,
    message,
    source: 'json (schema_validation)',
    type: 'error',
  }
}

const getExpectedTypes = (schema: JsonSchema): readonly string[] => {
  if (!schema.type) {
    return []
  }
  return typeof schema.type === 'string' ? [schema.type] : schema.type
}

const hasExpectedType = (
  text: string,
  node: AstNode,
  expectedTypes: readonly string[],
): boolean => {
  if (expectedTypes.length === 0) {
    return true
  }
  const actualType = typeNames.get(node.type)
  if (actualType && expectedTypes.includes(actualType)) {
    return true
  }
  return (
    actualType === 'number' &&
    expectedTypes.includes('integer') &&
    Number.isInteger(parseValue(text, node))
  )
}

const validateNode = (
  text: string,
  nodes: readonly AstNode[],
  index: number,
  schema: JsonSchema,
  diagnostics: Diagnostic[],
): number => {
  const node = nodes[index]
  if (!node) {
    return nodes.length
  }
  const expectedTypes = getExpectedTypes(schema)
  if (!hasExpectedType(text, node, expectedTypes)) {
    const actualType = typeNames.get(node.type) || 'unknown'
    diagnostics.push(
      createDiagnostic(
        text,
        node,
        'type',
        `Incorrect type. Expected ${expectedTypes.map((type) => JSON.stringify(type)).join(' or ')} but received ${JSON.stringify(actualType)}.`,
      ),
    )
    return getSubtreeEnd(nodes, index)
  }
  const value = parseValue(text, node)
  if (schema.enum && !schema.enum.includes(value)) {
    diagnostics.push(
      createDiagnostic(
        text,
        node,
        'enum',
        `Value is not accepted. Valid values: ${schema.enum.map((item) => JSON.stringify(item)).join(', ')}.`,
      ),
    )
  }
  if (node.type === TokenType.Object) {
    let childIndex = index + 1
    for (let i = 0; i < node.childCount && childIndex < nodes.length; i++) {
      const property = nodes[childIndex]
      const key = nodes[childIndex + 1]
      const valueNodeIndex = childIndex + 2
      const propertyName = key ? parseValue(text, key) : undefined
      if (
        property?.type === TokenType.Property &&
        key?.type === TokenType.String &&
        typeof propertyName === 'string'
      ) {
        const propertySchema = schema.properties?.[propertyName]
        if (propertySchema) {
          validateNode(text, nodes, valueNodeIndex, propertySchema, diagnostics)
        } else if (schema.additionalProperties === false) {
          diagnostics.push(
            createDiagnostic(
              text,
              key,
              'additionalProperties',
              `Property ${JSON.stringify(propertyName)} is not allowed.`,
            ),
          )
        } else if (typeof schema.additionalProperties === 'object') {
          validateNode(
            text,
            nodes,
            valueNodeIndex,
            schema.additionalProperties,
            diagnostics,
          )
        }
      }
      childIndex = getSubtreeEnd(nodes, childIndex)
    }
  } else if (node.type === TokenType.Array && schema.items) {
    let childIndex = index + 1
    for (let i = 0; i < node.childCount && childIndex < nodes.length; i++) {
      childIndex = validateNode(
        text,
        nodes,
        childIndex,
        schema.items,
        diagnostics,
      )
    }
  }
  return getSubtreeEnd(nodes, index)
}

export const getDiagnostics = (
  text: string,
  schema: JsonSchema,
): readonly Diagnostic[] => {
  const nodes = Jsonc.parse(text)
  if (nodes.length === 0) {
    return []
  }
  const diagnostics: Diagnostic[] = []
  validateNode(text, nodes, 0, schema, diagnostics)
  return diagnostics
}
