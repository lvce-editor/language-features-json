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
    console.log({ node, offset })
    const text = textDocument.text.slice(node.offset, node.offset + node.length)
    console.log({ text })
    const displayString = ''
    const documentation = schema?.properties?.type?.description || ''
    return {
      displayString,
      documentation,
    }
  }
  return undefined
}
