import type { Diagnostic } from '@lvce-editor/api'
import { getNodePath, parseTree, type Node } from 'jsonc-parser'
import * as GetPositionAt from '../GetPositionAt/GetPositionAt.ts'
import * as GetSchemaAtPath from '../GetSchemaAtPath/GetSchemaAtPath.ts'
import * as GetSchemaEnum from '../GetSchemaEnum/GetSchemaEnum.ts'
import * as GetSchemaTypes from '../GetSchemaTypes/GetSchemaTypes.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'

const getActualType = (node: Node): string => {
  return node.type
}

const isExpectedType = (
  node: Node,
  expectedTypes: readonly string[],
): boolean => {
  if (expectedTypes.length === 0) {
    return true
  }
  if (expectedTypes.includes(node.type)) {
    return true
  }
  return (
    node.type === 'number' &&
    expectedTypes.includes('integer') &&
    Number.isInteger(node.value)
  )
}

const createDiagnostic = (
  text: string,
  uri: string,
  node: Node,
  code: string,
  message: string,
): Diagnostic => {
  const start = GetPositionAt.getPositionAt(text, node.offset)
  const end = GetPositionAt.getPositionAt(text, node.offset + node.length)
  return {
    code,
    columnIndex: start.columnIndex,
    endColumnIndex: end.columnIndex,
    endRowIndex: end.rowIndex,
    message,
    rowIndex: start.rowIndex,
    source: 'json',
    type: 'error',
    uri,
  }
}

const validateNode = (
  text: string,
  uri: string,
  rootSchema: JsonSchema,
  node: Node,
  diagnostics: Diagnostic[],
): void => {
  const path = getNodePath(node)
  const schema = GetSchemaAtPath.getSchemaAtPath(rootSchema, path)
  const expectedTypes = GetSchemaTypes.getSchemaTypes(rootSchema, schema)
  if (!isExpectedType(node, expectedTypes)) {
    const expected = expectedTypes.map((type) => `"${type}"`).join(' or ')
    diagnostics.push(
      createDiagnostic(
        text,
        uri,
        node,
        'type',
        `Incorrect type. Expected ${expected} but received "${getActualType(node)}".`,
      ),
    )
    return
  }
  const allowedValues = GetSchemaEnum.getSchemaEnum(rootSchema, schema)
  if (
    allowedValues.length > 0 &&
    typeof node.value === 'string' &&
    !allowedValues.includes(node.value)
  ) {
    diagnostics.push(
      createDiagnostic(
        text,
        uri,
        node,
        'enum',
        `Value is not accepted. Valid values: ${allowedValues.map((value) => `"${value}"`).join(', ')}.`,
      ),
    )
  }
  if (node.type === 'object') {
    for (const property of node.children || []) {
      const value = property.children?.[1]
      if (value) {
        validateNode(text, uri, rootSchema, value, diagnostics)
      }
    }
  } else if (node.type === 'array') {
    for (const child of node.children || []) {
      validateNode(text, uri, rootSchema, child, diagnostics)
    }
  }
}

export const getDiagnostics = (
  text: string,
  uri: string,
  schema: JsonSchema,
): readonly Diagnostic[] => {
  const root = parseTree(text)
  if (!root) {
    return []
  }
  const diagnostics: Diagnostic[] = []
  validateNode(text, uri, schema, root, diagnostics)
  return diagnostics
}
