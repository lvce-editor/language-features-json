import * as PrepareJsonDocument from '../PrepareJsonDocument/PrepareJsonDocument.ts'
import * as TokenType from '../TokenType/TokenType.ts'

export const getHover = async (textDocument, offset) => {
  const parsed = await PrepareJsonDocument.prepareJsonDocument(
    textDocument,
    offset,
  )
  if (parsed === PrepareJsonDocument.emptyDocument) {
    return undefined
  }
  const { schema, node } = parsed
  if (node.type === TokenType.String) {
    const text = textDocument.text.slice(
      node.offset + 1,
      node.offset + node.length - 1,
    )
    const displayString = ''
    const documentation = schema?.properties?.[text]?.description || ''
    return {
      displayString,
      documentation,
    }
  }
  return undefined
}
