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
    const displayString = schema?.properties?.type?.description || ''
    const documentation = ''
    return {
      displayString,
      documentation,
    }
  }
  return undefined
}
