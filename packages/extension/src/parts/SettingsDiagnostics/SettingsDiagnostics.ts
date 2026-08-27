import type { Diagnostic } from '@lvce-editor/api'
import type { AstNode } from '../AstNode/AstNode.ts'
import type { JsonSchema } from '../JsonSchema/JsonSchema.ts'
import * as Jsonc from '../Jsonc/Jsonc.ts'
import * as TokenType from '../TokenType/TokenType.ts'

const getSubtreeEnd = (
  nodes: readonly AstNode[],
  index: number,
): number => {
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

const parsePropertyName = (
  text: string,
  node: AstNode,
): string | undefined => {
  try {
    const value: unknown = JSON.parse(
      text.slice(node.offset, node.offset + node.length),
    )
    return typeof value === 'string' ? value : undefined
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

const createUnknownSettingDiagnostic = (
  text: string,
  node: AstNode,
  propertyName: string,
): Diagnostic => {
  const start = getPosition(text, node.offset + 1)
  const end = getPosition(text, node.offset + node.length - 1)
  return {
    ...start,
    endColumnIndex: end.columnIndex,
    endRowIndex: end.rowIndex,
    message: `Unknown setting ${JSON.stringify(propertyName)}.`,
    source: 'json (settings_validation)',
    type: 'warning',
  }
}

export const getSettingsDiagnostics = (
  text: string,
  schema: JsonSchema,
): readonly Diagnostic[] => {
  const properties = schema.properties || {}
  const nodes = Jsonc.parse(text)
  const root = nodes[0]
  if (!root || root.type !== TokenType.Object) {
    return []
  }
  const diagnostics: Diagnostic[] = []
  let index = 1
  for (let i = 0; i < root.childCount && index < nodes.length; i++) {
    const property = nodes[index]
    const key = nodes[index + 1]
    if (
      property?.type === TokenType.Property &&
      key?.type === TokenType.String
    ) {
      const propertyName = parsePropertyName(text, key)
      if (propertyName !== undefined && !Object.hasOwn(properties, propertyName)) {
        diagnostics.push(
          createUnknownSettingDiagnostic(text, key, propertyName),
        )
      }
    }
    index = getSubtreeEnd(nodes, index)
  }
  return diagnostics
}
