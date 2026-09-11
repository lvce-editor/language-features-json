import type { DocumentSymbol, DocumentSymbolTextDocument } from '@lvce-editor/api'
import * as Jsonc from '../Jsonc/Jsonc.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const id = 'json.documentSymbols'
export const languageId = 'json'

const symbolKinds: Readonly<Record<number, number>> = {
  [TokenType.Object]: 19,
  [TokenType.Array]: 18,
  [TokenType.Number]: 16,
  [TokenType.String]: 15,
  [TokenType.Boolean]: 17,
  [TokenType.Null]: 21,
}

export const provideDocumentSymbols = ({ text }: DocumentSymbolTextDocument): readonly DocumentSymbol[] => {
  const nodes = Jsonc.parse(text)
  let index = 0
  const visit = (name: string): DocumentSymbol | undefined => {
    const node = nodes[index++]
    if (!node) {
      return undefined
    }
    let value = node
    let selection = node
    if (node.type === TokenType.Property) {
      selection = nodes[index++]
      try {
        name = JSON.parse(text.slice(selection.offset, selection.offset + selection.length))
      } catch {
        name = text.slice(selection.offset + 1, selection.offset + selection.length)
      }
      const candidate = nodes[index]
      if (!candidate || candidate.offset >= node.offset + node.length || candidate.type === TokenType.Property) {
        return undefined
      }
      value = candidate
      index++
    }
    const children: DocumentSymbol[] = []
    for (let childIndex = 0; childIndex < value.childCount && index < nodes.length; childIndex++) {
      if (nodes[index].offset >= value.offset + value.length) {
        break
      }
      const child = visit(String(childIndex))
      if (child) {
        children.push(child)
      }
    }
    return {
      name,
      kind: symbolKinds[value.type] || 19,
      startOffset: node.offset,
      endOffset: value.offset + value.length,
      selectionStartOffset: selection.offset,
      selectionEndOffset: selection.offset + selection.length,
      children,
    }
  }
  const root = visit('')
  return root?.children || []
}
